import AuthAPI from '../api/auth/auth-api';
import store from '../store/store';
import type { SignupFormData, LoginFormData } from '../types/types';
import Router from '../services/router';

class AuthController {
	public signup(data: SignupFormData) {
		// крутилка
		// валидация данных где должна быть
		AuthAPI.signup(data)
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					const response = JSON.parse(xhr.responseText || '{}');
					const id = response.id || response.user_id;
					if (id) {
						store.set('user', { id });
					}

					const router = Router.getInstance();
					if (router) {
						router.go('/messenger');
					}
				}
			})
			.catch((error) => {
				console.error('Signup error:', error);
			});
	}

	public login(data: LoginFormData) {
		AuthAPI.login(data)
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					const router = Router.getInstance();
					if (router) {
						router.go('/messenger');
					}
				}
			})
			.catch((error) => {
				console.error('Login error:', error);
			});
	}

	public logout() {
		AuthAPI.logout()
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					const router = Router.getInstance();
					if (router) {
						router.go('/');
					}
				}
			})
			.catch((error) => {
				console.error('Logout error:', error);
			});
	}

	// public async login(data: LoginFormModel) {
	// 	try {
	// 		// Запускаем крутилку            

	// 		const validateData = userLoginValidator(data);

	// 		if (!validateData.isCorrect) {
	// 			throw new Error(validateData);
	// 		}
		
	// 		const userID = loginApi.request(prepareDataToRequest(data));

	// 		RouteManagement.go('/chats');

	// 		// Останавливаем крутилку
	// 	} catch (error) {
	// 		// Логика обработки ошибок
	// }
	//}
}

export default new AuthController();
