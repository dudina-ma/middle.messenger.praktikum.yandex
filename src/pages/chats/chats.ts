import './chats.scss';
import chatsTemplate from './chats.template';
import { chatsData } from '../../mock/chatsData';
import { dialogData } from '../../mock/dialogData';
import Input from '../../components/input/input';
import render from '../../utils/render';
import Block from '../../services/block';
import Form from '../../components/form/form';
import Button from '../../components/button/button';

const messageInput = new Input('div', {
	name: 'message',
	type: 'text',
	placeholder: 'Сообщение',
	'class': 'chats-page__input',
	attr: {
		class: 'chats-page__message-field',
	},
});

const attachButton = new Button('button', {
	type: 'button',
	icon: true,
	iconClass: 'chats-page__message-attach-icon',
	attr: {
		class: 'chats-page__message-attach',
	},
});

const submitButton = new Button('button', {
	type: 'submit',
	icon: true,
	iconClass: 'chats-page__message-send-icon',
	attr: {
		class: 'chats-page__message-send',
	},
});

const messageForm = new Form('form', {
	attr: {
		class: 'chats-page__message-form',
	},
	formChildren: [attachButton, messageInput, submitButton],
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

const searchInput = new Input('div', {
	name: 'search',
	type: 'search',
	placeholder: 'Поиск',
	class: 'chats-page__search-input',
	icon: true,
	iconClass: 'chats-page__search-icon',
	attr: {
		class: 'chats-page__search-wrapper',
	},
});

const searchForm = new Form('form', {
	attr: {
		role: 'search',
		class: 'chats-page__search-form',
	},
	formChildren: [searchInput],
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

class ChatsPage extends Block {
	render() {
		return this.compile(chatsTemplate, { 
			chats: chatsData, 
			dialog: dialogData, 
			messageForm,
		});
	}
}

const chatsPage = new ChatsPage('div', {
	messageForm,
	searchForm,
	attr: { class: 'chats-page__main-content' },
});

render('#chats', chatsPage);
