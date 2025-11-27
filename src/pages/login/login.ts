import './login.scss';
import loginTemplate from './login.template';
import Input from '../../components/input/input';
import render from '../../utils/render';
import Block from '../../services/block';
import Form from '../../components/form/form';
import Button from '../../components/button/button';
import Link from '../../components/link/link';
import { validateForm } from '../../services/validation';
import { handleFormSubmit, handleInputFocusOut } from '../../utils/formHelpers';

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
		class: 'login-form__link',
		href: '/pages/signup/signup',
	},
});

const inputsByName = {
	login: loginInput,
	password: passwordInput,
};

const loginForm = new Form('form', {
	attr: {
		class: 'login-form',
	},
	title: 'Вход',
	titleClass: 'login-form__title',
	formChildren: [loginInput, passwordInput, submitButton],
	events: {
		focusout: (e: Event) => {
			handleInputFocusOut(e, inputsByName);
		},
		submit: (e: Event) => {
			const data = handleFormSubmit(e);
			if (!data) return;
	
			const errors = validateForm(data);

			loginInput.setProps({
				error: Boolean(errors.login),
				errorText: errors.login,
				value: data.login,
			});

			passwordInput.setProps({
				error: Boolean(errors.password),
				errorText: errors.password,
				value: data.password,
			});

			console.log('Form data:', data);
		},
	},
});

interface LoginPageProps {
	loginForm: Form;
	loginLink: Link;
}

class LoginPage extends Block<LoginPageProps> {
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
