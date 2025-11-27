import './signup.scss';
import signupTemplate from './signup.template';
import Input from '../../components/input/input';
import render from '../../utils/render';
import Block from '../../services/block';
import Form from '../../components/form/form';
import Button from '../../components/button/button';
import Link from '../../components/link/link';
import { validateForm } from '../../services/validation';
import { handleFormSubmit, handleInputFocusOut } from '../../utils/formHelpers';

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
	name: 'password_repeated',
	type: 'password',
	placeholder: 'Пароль (еще раз)',
	label: 'Пароль (еще раз)',
	class: 'input-field__input',
	attr: {
		class: 'input-field',
	},
});

const inputsByName = {
	email: emailInput,
	login: loginInput,
	first_name: firstNameInput,
	second_name: secondNameInput,
	phone: phoneInput,
	password: passwordInput,
	password_repeated: passwordRepeatedInput,
};

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
		focusout: (e: Event) => {
			handleInputFocusOut(e, inputsByName, (name, value, form) => {
				if (name === 'password_repeated' && form) {
					const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
					if (passwordInput && value && value !== passwordInput.value) {
						return 'Пароли не совпадают';
					}
				}

				if (name === 'password' && form) {
					const passwordRepeatedInput = form.querySelector('input[name="password_repeated"]') as HTMLInputElement;
					if (passwordRepeatedInput && passwordRepeatedInput.value && value !== passwordRepeatedInput.value) {
						passwordRepeatedInput.dispatchEvent(new Event('focusout'));
					}
				}

				return null;
			});
		},
		submit: (e: Event) => {
			const data = handleFormSubmit(e);
			if (!data) return;

			const errors = validateForm(data);

			if (data.password && data.password_repeated && data.password !== data.password_repeated) {
				errors.password_repeated = 'Пароли не совпадают';
			}

			Object.keys(inputsByName).forEach((key) => {
				const input = inputsByName[key as keyof typeof inputsByName];
				input.setProps({
					error: Boolean(errors[key]),
					errorText: errors[key],
					value: data[key] || input.props.value,
				});
			});

			console.log('Form data:', data);
		},
	},
});

const signupLink = new Link('a', {
	text: 'Войти',
	attr: {
		class: 'signup-form__link',
		href: '/pages/login/login',
	},
});

interface SignupPageProps {
	signupForm: Form;
	signupLink: Link;
}

class SignupPage extends Block<SignupPageProps> {
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
