import HttpClient from '../../services/httpClient';
import { API_BASE_URLS } from '../index';
import type { SignupFormData } from '../../types/types';
import type { LoginFormData } from '../../types/types';
import { showErrorAlert } from '../../utils/errorAlert';

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
		} })
			.catch((error) => {
				console.error('Signup error:', error);
				showErrorAlert('Ошибка при регистрации. Попробуйте еще раз.');
				throw error;
			});
	}
	login(data: LoginFormData) {
		return authAPIInstance.post('/signin', { data: {
			login: data.login,
			password: data.password,
		} })
			.catch((error) => {
				console.error('Login error:', error);
				showErrorAlert('Ошибка при входе. Проверьте логин и пароль.');
				throw error;
			});
	}
	logout() {
		return authAPIInstance.post('/logout')
			.catch((error) => {
				console.error('Logout error:', error);
				showErrorAlert('Ошибка при выходе из системы.');
				throw error;
			});
	}
	getUser(shouldIgnoreError: boolean = false) {
		return authAPIInstance.get('/user')
			.catch((error) => {
				console.error('Get user error:', error);

				if (!shouldIgnoreError) {
					showErrorAlert('Ошибка при получении данных пользователя.');
				}

				throw error;
			});
	}
}

export default new AuthAPI();
