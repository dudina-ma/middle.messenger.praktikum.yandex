import './signup.scss';
import Handlebars from 'handlebars';
import signupTemplate from './signup.template';
import inputTemplate from '../../components/partials/input.template';

Handlebars.registerPartial('input', inputTemplate);

document.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('#signup');

	const template = Handlebars.compile(signupTemplate);

	const result = template({});

	if (root) {
		root.innerHTML = result;
	}
});
