import HttpClient from '../../services/httpClient';
import { API_BASE_URLS } from '../index';
import store from '../../store/store';

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
				throw error;
			});
	}
}

export default new UserAPI();
