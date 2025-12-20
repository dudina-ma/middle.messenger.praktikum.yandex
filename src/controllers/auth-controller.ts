import AuthAPI from '../api/auth/auth-api';
import store from '../store/store';
import type { SignupFormData, LoginFormData } from '../types/types';
import Router from '../services/router';

class AuthController {
	public signup(data: SignupFormData) {
		AuthAPI.signup(data)
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					this.getUser().then(() => {
						const router = Router.getInstance();
						if (router) {
							router.go('/messenger');
						}
					});
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
					this.getUser().then(() => {
						const router = Router.getInstance();
						if (router) {
							router.go('/messenger');
						}
					});
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
			})
			.finally(() => {
				store.set('user', null);
			});
	}
	public getUser(shouldIgnoreError: boolean = false) {
		return AuthAPI.getUser(shouldIgnoreError)
			.then((xhr) => {
				if (xhr.status >= 200 && xhr.status < 300) {
					const response = JSON.parse(xhr.responseText || '{}');
					store.set('user', response);
					return response;
				} else {
					throw new Error(`Failed to get user: ${xhr.status}`);
				}
			})
			.catch((error) => {
				console.error('Get user error:', error);
				throw error;
			});
	}
}

export default new AuthController();
