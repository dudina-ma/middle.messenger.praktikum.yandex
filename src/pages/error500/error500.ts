import './error500.scss';
import Handlebars from 'handlebars';
import error500Template from './error500.template';
import errorTemplate from '../../components/partials/error.template';

Handlebars.registerPartial('error', errorTemplate);

document.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('#error500');

	const template = Handlebars.compile(error500Template);

	const result = template({});

	if (root) {
		root.innerHTML = result;
	}
});

