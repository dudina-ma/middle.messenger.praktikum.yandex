import ChatsAPI from '../api/chats/chats-api';
import store from '../store/store';
import UserController from './user-controller';
import type { User } from '../types/types';

class ChatsController {
    
	public getChats() {
		return ChatsAPI.getChats()
			.then((chats) => {
				store.set('chats', chats);
			});
	}

	public createChat(data: { title: string }) {
		return ChatsAPI.createChat(data)
			.then(() => {
				this.getChats();
			})
			.catch((error) => {
				console.error('Create chat error:', error);
				throw error;
			});
	}

	public addUser(data: { userName: string, chatId: number }) {
		UserController.getUserByLogin(data.userName)
			.then((user: User) => {
				return user.id;
			})
			.catch((error) => {
				console.error('Get user by login error:', error);
				throw error;
			})
			.then((id) => {
				return ChatsAPI.addUser({ userId: id as number, chatId: data.chatId });
			});
		// где должна быть обработка ошибки
		// if (!userId) {
		// 	throw new Error('User not found');
		// }
	}

	public deleteUser(data: { userName: string, chatId: number }) {
		UserController.getUserByLogin(data.userName)
			.then((user: User) => {
				return user.id;
			})
			.catch((error) => {
				console.error('Get user by login error:', error);
				throw error;
			})
			.then((id) => {
				return ChatsAPI.deleteUser({ userId: id as number, chatId: data.chatId });
			});
		// где должна быть обработка ошибки
		// if (!userId) {
		// 	throw new Error('User not found');
		// }
	}
}

export default new ChatsController();
