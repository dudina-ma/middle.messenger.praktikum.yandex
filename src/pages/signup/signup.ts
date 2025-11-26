import './signup.scss';
import signupTemplate from './signup.template';
import Input from '../../components/input/input';
import render from '../../utils/render';
import Block from '../../services/block';
import Form from '../../components/form/form';
import Button from '../../components/button/button';
import Link from '../../components/link/link';

const emailInput = new Input('div', {
	name: 'email',
	type: 'email',
	placeholder: 'Почта',
	label: 'Почта',
	class: 'input-field__input',
	attr: {
		class: 'input-field',
	},
});

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

const firstNameInput = new Input('div', {
	name: 'first_name',
	type: 'text',
	placeholder: 'Имя',
	label: 'Имя',
	class: 'input-field__input',
	attr: {
		class: 'input-field',
	},
});

const secondNameInput = new Input('div', {
	name: 'second_name',
	type: 'text',
	placeholder: 'Фамилия',
	label: 'Фамилия',
	class: 'input-field__input',
	attr: {
		class: 'input-field',
	},
});

const phoneInput = new Input('div', {
	name: 'phone',
	type: 'tel',
	placeholder: 'Телефон',
	label: 'Телефон',
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

const passwordRepeatedInput = new Input('div', {
	name: 'password-repeated',
	type: 'password',
	placeholder: 'Пароль (еще раз)',
	label: 'Пароль (еще раз)',
	class: 'input-field__input',
	attr: {
		class: 'input-field',
	},
});

const submitButton = new Button('button', {
	type: 'submit',
	text: 'Зарегистрироваться',
	attr: {
		class: 'signup-form__button',
	},
});

const signupForm = new Form('form', {
	attr: {
		class: 'signup-form',
	},
	title: 'Регистрация',
	titleClass: 'signup-form__title',
	formChildren: [emailInput, loginInput, firstNameInput, secondNameInput, phoneInput, passwordInput, passwordRepeatedInput, submitButton],
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

const signupLink = new Link('a', {
	text: 'Войти',
	attr: {
		href: '/pages/login/login',
		class: 'signup-form__link',
	},
});

class SignupPage extends Block {
	render() {
		return this.compile(signupTemplate, { 
			signupForm,
			signupLink,
		});
	}
}

const signupPage = new SignupPage('div', {
	signupForm,
	signupLink,
});

render('#signup', signupPage);
