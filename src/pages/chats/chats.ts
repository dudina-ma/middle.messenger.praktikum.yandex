import './chats.scss';
import Handlebars from 'handlebars';
import chatsTemplate from './chats.template';
import inputTemplate from '../../components/partials/input.template';
import { chatsData } from '../../mock/chatsData';
import { dialogData } from '../../mock/dialogData';

Handlebars.registerPartial('input', inputTemplate);

document.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('#chats');

	const template = Handlebars.compile(chatsTemplate);

	const result = template({ chats: chatsData, dialog: dialogData });

	if (root) {
		root.innerHTML = result;
	}
});


