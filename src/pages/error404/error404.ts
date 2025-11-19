import './error404.scss';
import Handlebars from 'handlebars';
import error404Template from './error404.template';
import errorTemplate from '../../components/partials/error.template';

Handlebars.registerPartial('error', errorTemplate);

document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('#error404');

    const template = Handlebars.compile(error404Template);

    const result = template({});

    if (root) {
        root.innerHTML = result;
    }
});

