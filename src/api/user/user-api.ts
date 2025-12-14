import HttpClient from '../../services/httpClient';
import { API_BASE_URLS } from '../index';
import type { User, ChangePasswortdData } from '../../types/types';

const userAPIInstance = new HttpClient(API_BASE_URLS.user);

//   updateAvatar: (form: FormData): Promise<unknown> =>
//     httpClient.put('profile/avatar', { data: form }),

//  BaseAPI
// нужны эти перекладывания? из даты в дату
class UserAPI {
	editProfile(data: User) {
		return userAPIInstance.put('/profile', { data: {
			first_name: data.first_name,
			second_name: data.second_name,
			login: data.login,
			email: data.email,
			phone: data.phone,
            display_name: data.display_name
		} });
	}
	changePassword(data: ChangePasswortdData) {
		return userAPIInstance.put('/password', { data: {
			oldPassword: data.oldPassword,
			newPassword: data.newPassword
		} });
	}
}

export default new UserAPI();
