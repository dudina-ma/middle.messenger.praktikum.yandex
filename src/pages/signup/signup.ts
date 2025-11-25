import './signup.scss';
import signupTemplate from './signup.template';
import Input from '../../components/input/input';
import render from '../../utils/render';
import Block from '../../services/block';

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

class SignupPage extends Block {
	render() {
		return this.compile(signupTemplate, { 
			emailInput,
			loginInput,
			firstNameInput,
			secondNameInput,
			phoneInput,
			passwordInput,
			passwordRepeatedInput,
		});
	}
}

const signupPage = new SignupPage('div', {
	emailInput,
	loginInput,
	firstNameInput,
	secondNameInput,
	phoneInput,
	passwordInput,
	passwordRepeatedInput,
});

render('#signup', signupPage);


