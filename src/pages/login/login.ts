import './login.scss';
import loginTemplate from './login.template';
import Input from '../../components/input/input';
import render from '../../utils/render';
import Block from '../../services/block';
import Form from '../../components/form/form';
import Button from '../../components/button/button';
import Link from '../../components/link/link';

const loginInput = new Input('div', {
	name: 'login',
	type: 'text',
	placeholder: 'Логин',
	label: 'Логин',
	class: 'input-field__input',
	attr: {
		class: 'input-field',
	},
});

const passwordInput = new Input('div', {
	name: 'password',
	type: 'password',
	placeholder: 'Пароль',
	label: 'Пароль',
	class: 'input-field__input',
	attr: {
		class: 'input-field',
	},
});

const submitButton = new Button('button', {
	type: 'submit',
	text: 'Войти',
	attr: {
		class: 'login-form__button',
	},
});

const loginLink = new Link('a', {
	text: 'Создать аккаунт',
	attr: {
		href: '/pages/signup/signup',
		class: 'login-form__link',
	},
});

const loginForm = new Form('form', {
	attr: {
		class: 'login-form',
	},
	title: 'Вход',
	titleClass: 'login-form__title',
	formChildren: [loginInput, passwordInput, submitButton],
	events: {
		submit: (e: Event) => {
			e.preventDefault();
			const form = e.target as HTMLFormElement;
			const formData = new FormData(form);
			
			const data: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				data[key] = value.toString();
			}
	
			console.log('Form data:', data);
		},
	},
});

class LoginPage extends Block {
	render() {
		return this.compile(loginTemplate, { 
			loginForm,
			loginLink,
		});
	}
}

const loginPage = new LoginPage('div', {
	loginForm,
	loginLink,
});

render('#login', loginPage);

