import HttpClient from '../../services/httpClient';
import { API_BASE_URLS } from '../index';
import type { SignupFormData } from '../../types/types';

const authAPIInstance = new HttpClient(API_BASE_URLS.auth);

// class LoginAPI extends BaseAPI {
//     public request(user: LoginRequest) {
//       return authAPIInstance.post<LoginRequest, LoginResponse>('/login', user)
//         .then(({user_id}) => user_id); // Обрабатываем получение данных из сервиса далее
//     }
//   }

//  BaseAPI
class AuthAPI {
	create(data: SignupFormData) {
		return authAPIInstance.post('/signup', { data: {
			first_name: data.first_name,
			second_name: data.second_name,
			login: data.login,
			email: data.email,
			password: data.password,
			phone: data.phone,
		} });
	}
}

export default new AuthAPI();
