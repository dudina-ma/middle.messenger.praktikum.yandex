import ChatsAPI from '../api/chats/chats-api';
import store from '../store/store';
import UserController from './user-controller';
import type { Message, User } from '../types/types';
import { WebSocketClient, WebSocketClientEvents } from '../services/web-socket-client';
import { API_BASE_URLS } from '../api';

class ChatsController {
    private webSocketClient: WebSocketClient | null = null;

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

	public getChatToken(chatId: number): Promise<string> {
		return ChatsAPI.getChatToken(chatId);
	}

	public selectChat(chatId: number) {
		if (chatId !== store.getState().selectedChatId) {
			this.openConnection(chatId);
		}

		store.set('selectedChatId', chatId);
	}

	private openConnection(chatId: number) {
		this.webSocketClient?.close();

		const userId = store.getState().user?.id;

		this.getChatToken(chatId)
			.then((token) => {
				const wsUrl = `${API_BASE_URLS.ws}/${userId}/${chatId}/${token}`;
				
				this.webSocketClient = new WebSocketClient(wsUrl);

				this.subscribeToMessages();
				
				return this.webSocketClient.connect();
			})
			.then(() => {
				this.webSocketClient?.send({
					content: '0',
					type: 'get old',
				});
			})
			.catch((error) => {
				console.error('WebSocket connection error:', error);
			});
	}

	public closeConnection() {
		this.webSocketClient?.close();
	}

	private formatTime(isoString: string): string {
		const date = new Date(isoString);
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${hours}:${minutes}`;
	}

	private addIsFromMeFlag(message: Message): Message {
		const userId = store.getState().user?.id;
		return {
			...message,
			isFromMe: message.user_id === userId,
			time: this.formatTime(message.time),
		};
	}
	
	private addMessage(message: Message) {
		const messageWithFlag = this.addIsFromMeFlag(message);

		const currentMessages = store.getState().chatMessages || [];
		store.set('chatMessages', [messageWithFlag, ...currentMessages]);
	}

	private setOldMessages(messages: Message[]) {
		const messagesWithFlags = messages.map((message) => this.addIsFromMeFlag(message));

		store.set('chatMessages', messagesWithFlags);
	}

	private subscribeToMessages() {
		this.webSocketClient?.on(WebSocketClientEvents.Message, (data: unknown) => {
			if (Array.isArray(data)) {
				this.setOldMessages(data);
			} else {
				this.addMessage(data as Message);
			}
		});
	}

	public sendMessage(message: string) {
		this.webSocketClient?.send({
			content: message,
			type: 'message',
		});
	}
}

export default new ChatsController();
