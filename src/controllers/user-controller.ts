import UserAPI from '../api/user/user-api';
import store from '../store/store';
import type { User, ChangePasswortdData } from '../types/types';

// где должен быть этот enum
export enum ProfilePageMode {
	VIEW_DATA = 'view_data',
	EDIT_DATA = 'edit_data',
	CHANGE_PASSWORD = 'change_password',
}

class UserController {
	public setProfilePageMode(mode: ProfilePageMode) {
		store.set('profile.pageMode', mode);
	}

	// работа с ошибками
	public editProfile(data: User) {
		return UserAPI.editProfile(data)
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					const response = JSON.parse(xhr.responseText || '{}');
					store.set('user', response);
					return response;
				}
			});
	}

	public changePassword(data: ChangePasswortdData) {
		return UserAPI.changePassword(data)
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					return true;
				} else {
					throw new Error(`Failed to change password: ${xhr.status}`);
				}
			})
			.catch((error) => {
				console.error('Change password error:', error);
				throw error;
			});
	}

	public getUserByLogin(login: string) {
		return UserAPI.getUserByLogin(login)
			.then((user: User[] | undefined) => {
				if (!user) {
					throw new Error('User not found');
				}
				return user[0];
			})
			.catch((error) => {
				console.error('Get user by login error:', error);
				throw error;
			});
	}

	public changeAvatar(avatar: File) {
		return UserAPI.changeAvatar(avatar)
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					const response = JSON.parse(xhr.responseText || '{}');
					store.set('user', response);
					return response;
				}
			})
			.catch((error) => {
				console.error('Change avatar error:', error);
				throw error;
			});
	}
}

export default new UserController();
