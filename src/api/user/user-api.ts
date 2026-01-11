import HttpClient from '../../services/http-client';
import { API_BASE_URLS } from '../index';
import type { User, ChangePasswortdData } from '../../types/types';
import { showErrorAlert } from '../../utils/errorAlert';

const userAPIInstance = new HttpClient(API_BASE_URLS.user);

class UserAPI {
	editProfile(data: User) {
		return userAPIInstance.put('/profile', { data: {
			first_name: data.first_name,
			second_name: data.second_name,
			login: data.login,
			email: data.email,
			phone: data.phone,
			display_name: data.display_name,
		} })
			.catch((error) => {
				console.error('Edit profile error:', error);
				showErrorAlert('Ошибка при изменении профиля.');
				throw error;
			});
	}
	changePassword(data: ChangePasswortdData) {
		return userAPIInstance.put('/password', { data: {
			oldPassword: data.oldPassword,
			newPassword: data.newPassword,
		} })
			.catch((error) => {
				console.error('Change password error:', error);
				showErrorAlert('Ошибка при изменении пароля.');
				throw error;
			});
	}
	getUserByLogin(data: string) {
		return userAPIInstance.post('/search', { data: { login: data } })
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					const response = JSON.parse(xhr.responseText || '{}') as User[];
					return response;
				}
			})
			.catch((error) => {
				console.error('Get user by login error:', error);
				showErrorAlert('Ошибка при поиске пользователя.');
				throw error;
			});
	}
	changeAvatar(avatar: File) {
		const formdata = new FormData();
		formdata.append ('avatar', avatar);
		return userAPIInstance.put('/profile/avatar', { data: formdata })
			.catch((error) => {
				console.error('Change avatar error:', error);
				showErrorAlert('Ошибка при загрузке аватара.');
				throw error;
			});
	}
}

export default new UserAPI();
