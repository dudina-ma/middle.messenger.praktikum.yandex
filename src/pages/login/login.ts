import './login.scss';
import Handlebars from 'handlebars';
import loginTemplate from './login.template';
import inputTemplate from '../../components/partials/input.template';

Handlebars.registerPartial('input', inputTemplate);

document.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('#login');

	const template = Handlebars.compile(loginTemplate);

	const result = template({});

	if (root) {
		root.innerHTML = result;
	}
});
