import './chats.scss';
import chatsTemplate from './chats.template';
import { dialogData } from '../../mock/dialogData';
import Input from '../../components/input/input';
import Block from '../../services/block';
import Form from '../../components/form/form';
import Button from '../../components/button/button';
import { handleFormSubmit } from '../../utils/formHelpers';
import Router from '../../services/router';
import Link from '../../components/link/link';
import type { Chat } from '../../types/types';
import ChatsController from '../../controllers/chats-controller';
import connect from '../../services/hoc';
import type { State } from '../../store/store';
import Modal from '../../components/modal/modal';

interface ChatsPageProps {
	chats: Chat[];
	dialog: typeof dialogData;
}

// TODO: возможно, для компонентов, у которых по смыслу нет пропсов, надо закрывать дженерик {}
class ChatsPage extends Block<ChatsPageProps> {
	constructor(...args: ConstructorParameters<typeof Block<ChatsPageProps>>) {
		super(...args);

		ChatsController.getChats();
	}
	render() {
		const messageInput = new Input('div', {
			name: 'message',
			type: 'text',
			placeholder: 'Сообщение',
			class: 'chats-page__input',
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
					const data = handleFormSubmit(e);
					if (!data) return;
			
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

		const createChatInput = new Input('div', {
			name: 'chatTitle',
			type: 'text',
			label: 'Название чата',
			placeholder: 'Название чата',
			class: 'input-field__input',
			attr: {
				class: 'input-field',
			},
		});

		const createChatSubmitButton = new Button('button', {
			type: 'submit',
			text: 'Создать',
			attr: {
				class: 'create-chat-submit-button',
			},
		});

		const createChatForm = new Form('form', {
			attr: {
				class: 'create-chat-form',
			},
			formChildren: [createChatInput, createChatSubmitButton],
			events: {
				submit: (e: Event) => {
					const data = handleFormSubmit(e);
					if (!data) return;
					console.log('Form data:', data);

					ChatsController.createChat({ title: data.chatTitle });
					modal.close();
				},
			},
		});

		const modal = new Modal('dialog', {
			title: 'Создание чата',
			formChildren: [createChatForm],
		});

		const createChatButton = new Button('button', {
			type: 'button',
			text: 'Создать чат',
			attr: {
				class: 'chats-page__create-chat-button',
			},
			events: {
				click: () => {
					modal.open();
				},
			},
		});

		const profileLink = new Link('a', {
			text: 'Профиль',
			attr: {
				class: 'chats-page__profile-link',
				// нужна ли
				href: '/settings',
			},
			icon: true,
			iconText: '>',
			iconClass: 'chats-page__profile-link-arrow',
			events: {
				click: (event: Event) => {
					event.preventDefault();

					const router = Router.getInstance();
					// else
					if (router) {
						router.go('/settings');
					}
				},
			},
		});

		this.children = {
			messageForm,
			searchForm,
			profileLink,
			createChatButton,
			modal,
		};

		const dialog = (this.props as ChatsPageProps).dialog || dialogData;

		return this.compile(chatsTemplate, this.props);
	}
}

function mapStateToProps(state: State) {
	return {
		chats: state.chats,
	};
}

export default connect(mapStateToProps)(ChatsPage);
