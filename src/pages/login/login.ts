import './login.scss';
import loginTemplate from './login.template';
import Input from '../../components/input/input';
import render from '../../utils/render';
import Block from '../../services/block';

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
	name: 'message',
	type: 'password',
	placeholder: 'Пароль',
	label: 'Пароль',
	class: 'input-field__input',
	attr: {
		class: 'input-field',
	},
});

class LoginPage extends Block {
	render() {
		return this.compile(loginTemplate, { 
			loginInput,
			passwordInput,
		});
	}
}

const loginPage = new LoginPage('div', {
	loginInput,
	passwordInput,
});

render('#login', loginPage);

