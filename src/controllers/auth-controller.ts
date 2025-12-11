import AuthAPI from '../api/auth/auth-api';
import store from '../store/store';
import type { SignupFormData } from '../types/types';

class AuthController {
	public signup(data: SignupFormData) {
		// крутилка
		// валидация данных 
		AuthAPI.create(data)
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					const response = JSON.parse(xhr.responseText || '{}');
					const id = response.id || response.user_id;
					if (id) {
						store.set('user', { id });
					}
				}
			})
			.catch((error) => {
				console.error('Signup error:', error);
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

// interface LoginFormModel {
// 	email: string;
// 	password: string;
//   }
  
//   // controllers/user-login.ts
  
//   const loginApi = new LoginAPI();
//   const userLoginValidator = validateLoginFields(validateRules);
  
//   class UserLoginController {
	
//   }
