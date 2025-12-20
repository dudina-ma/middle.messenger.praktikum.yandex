import HttpClient from '../../services/httpClient';
import { API_BASE_URLS } from '../index';
import store from '../../store/store';
import { showErrorAlert } from '../../utils/errorAlert';

const userAPIInstance = new HttpClient(API_BASE_URLS.chats);
const chatsAPIInstance = new HttpClient(API_BASE_URLS.chats);

class UserAPI {
	getChats() {
		return userAPIInstance.get('/')
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					const response = JSON.parse(xhr.responseText || '{}');
					store.set('chats', response);
					return response;
				}
			})
			.catch((error) => {
				console.error('Get chats error:', error);
				showErrorAlert('Ошибка при загрузке чатов.');
				throw error;
			});
	}

	createChat(data: { title: string }) {
		return userAPIInstance.post('/', { data: { title: data.title } })
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					const response = JSON.parse(xhr.responseText || '{}');
					// возвращается id
					return response;
				}
			})
			.catch((error) => {
				console.error('Create chat error:', error);
				showErrorAlert('Ошибка при создании чата.');
				throw error;
			});
	}

	addUser(data: { userId: number, chatId: number }) {
		return chatsAPIInstance.put('/users', { data: {
			users: [data.userId],
			chatId: data.chatId,
		} })
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					return true;
				}
			})
			.catch((error) => {
				console.error('Add user error:', error);
				showErrorAlert('Ошибка при добавлении пользователя в чат.');
				throw error;
			});
	}

	deleteUser(data: { userId: number, chatId: number }) {
		return chatsAPIInstance.delete('/users', { data: {
			users: [data.userId],
			chatId: data.chatId,
		} })
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					return true;
				}
			})
			.catch((error) => {
				console.error('Delete user error:', error);
				showErrorAlert('Ошибка при удалении пользователя из чата.');
				throw error;
			});
	}

	getChatToken(chatId: number) {
		return chatsAPIInstance.post(`/token/${chatId}`)
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					const response = JSON.parse(xhr.responseText || '{}');
					return response.token as string;
				}
				throw new Error(`Failed to get chat token: ${xhr.status}`);
			})
			.catch((error) => {
				console.error('Get chat token error:', error);
				showErrorAlert('Ошибка при подключении к чату.');
				throw error;
			});
	}
}

export default new UserAPI();
