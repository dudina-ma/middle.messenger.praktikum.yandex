import HttpClient from '../../services/httpClient';
import { API_BASE_URLS } from '../index';
import store from '../../store/store';

const userAPIInstance = new HttpClient(API_BASE_URLS.chats);

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
}

export default new UserAPI();
