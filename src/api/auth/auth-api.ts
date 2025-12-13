import HttpClient from '../../services/httpClient';
import { API_BASE_URLS } from '../index';
import type { SignupFormData } from '../../types/types';
import type { LoginFormData } from '../../types/types';

const authAPIInstance = new HttpClient(API_BASE_URLS.auth);

// где должен быть then
// class LoginAPI extends BaseAPI {
//     public request(user: LoginRequest) {
//       return authAPIInstance.post<LoginRequest, LoginResponse>('/login', user)
//         .then(({user_id}) => user_id); // Обрабатываем получение данных из сервиса далее
//     }
//   }

//  BaseAPI
class AuthAPI {
	signup(data: SignupFormData) {
		return authAPIInstance.post('/signup', { data: {
			first_name: data.first_name,
			second_name: data.second_name,
			login: data.login,
			email: data.email,
			password: data.password,
			phone: data.phone,
		} });
	}
	login(data: LoginFormData) {
		return authAPIInstance.post('/signin', { data: {
			login: data.login,
			password: data.password,
		} });
	}
	logout() {
		return authAPIInstance.post('/logout');
	}
	getUser() {
		return authAPIInstance.get('/user');
	}
}

export default new AuthAPI();
