import './chats.scss';
import chatsTemplate from './chats.template';
import { chatsData } from '../../mock/chatsData';
import { dialogData } from '../../mock/dialogData';
import Input from '../../components/input/input';
import render from '../../utils/render';
import Block from '../../services/block';

const input = new Input('div', {
	name: 'message',
	type: 'text',
	placeholder: 'Сообщение',
	'class': 'chats-page__input',
	attr: {
		class: 'chats-page__message-field',
	},
});

class ChatsPage extends Block {
	render() {
		return this.compile(chatsTemplate, { 
			chats: chatsData, 
			dialog: dialogData, 
			input,
		});
	}
}

const chatsPage = new ChatsPage('div', {
	input,
	attr: { class: 'chats-page__main-content' },
});

render('#chats', chatsPage);
