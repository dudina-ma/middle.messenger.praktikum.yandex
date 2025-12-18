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
import type { Chat as ChatType } from '../../types/types';
import ChatsController from '../../controllers/chats-controller';
import connect from '../../services/hoc';
import type { State } from '../../store/store';
import Modal from '../../components/modal/modal';
import ChatListItem from '../../components/chat-list-item/chat-list-item';

interface ChatsPageProps {
	chats: ChatType[];
	dialog: typeof dialogData;
	selectedChatId: number | null;
}

// TODO: возможно, для компонентов, у которых по смыслу нет пропсов, надо закрывать дженерик {}
class ChatsPage extends Block<ChatsPageProps> {
	// типизация
	constructor(...args: ConstructorParameters<typeof Block<ChatsPageProps>>) {
		super(...args);

		ChatsController.getChats();
	}

	render() {
 		const chats = this.props.chats || [];

		console.log(chats);

		let chatList: Block<object>[] = [];

		if (chats) {
			chatList = chats.map((chat) => {
				return new ChatListItem('li', {
					chatData: chat,
					events: {
						click: () => {
							this.props.selectedChatId = chat.id;
							this.setProps({
								selectedChatId: chat.id,
							});
						},
					},
					attr: {
						class: chat.id === this.props.selectedChatId ? 'chat__item chat__item--selected' : 'chat__item',
					},
				});
			});
		}

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
					createChatModal.close();
				},
			},
		});

		const createChatModal = new Modal('dialog', {
			title: 'Создание чата',
			modalChildren: [createChatForm],
		});

		const createChatButton = new Button('button', {
			type: 'button',
			text: 'Создать чат',
			attr: {
				class: 'chats-page__create-chat-button',
			},
			events: {
				click: () => {
					createChatModal.open();
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

		const dialogMenuButton = new Button('button', {
			type: 'button',
			attr: {
				class: 'chats-page__dialog-menu',
			},
			icon: true,
			iconClass: 'chats-page__dialog-menu-icon',
		});

		const addUserButton = new Button('button', {
			type: 'button',
			attr: {
				class: 'chats-page__context-menu-item',
			},
			icon: true,
			iconClass: 'chats-page__context-menu-icon chats-page__context-menu-icon--add',
			text: 'Добавить пользователя',
			events: {
				click: () => {
					addUserModal.open();
				},
			},
		});

		const addUserInput = new Input('div', {
			name: 'username',
			type: 'text',
			placeholder: 'Логин',
			label: 'Логин',
			class: 'input-field__input',
			attr: {
				class: 'input-field',
			},
		});

		const addUserSubmitButton = new Button('button', {
			type: 'submit',
			text: 'Добавить',
			attr: {
				class: 'add-user-submit-button',
			},
		});

		const addUserForm = new Form('form', {
			attr: {
				class: 'add-user-form',
			},
			formChildren: [addUserInput, addUserSubmitButton],
			events: {
				submit: (e: Event) => {
					const data = handleFormSubmit(e);
					if (!data) return;

					console.log('Form data:', data);
					
					ChatsController.addUser({ userName: data.username, chatId: this.props.selectedChatId as number });
					addUserModal.close();
				},
			},
		});

		const addUserModal = new Modal('dialog', {
			title: 'Добавить пользователя',
			modalChildren: [addUserForm],
		});

		const deleteUserButton = new Button('button', {
			type: 'button',
			attr: {
				class: 'chats-page__context-menu-item',
			},
			icon: true,
			iconClass: 'chats-page__context-menu-icon chats-page__context-menu-icon--delete',
			text: 'Удалить пользователя',
			events: {
				click: () => {
					deleteUserModal.open();
				},
			},
		});

		const deleteUserInput = new Input('div', {
			name: 'username',
			type: 'text',
			placeholder: 'Логин',
			label: 'Логин',
			class: 'input-field__input',
			attr: {
				class: 'input-field',
			},
		});

		const deleteUserSubmitButton = new Button('button', {
			type: 'submit',
			text: 'Удалить',
			attr: {
				class: 'delete-user-submit-button',
			},
		});

		const deleteUserForm = new Form('form', {
			attr: {
				class: 'delete-user-form',
			},
			formChildren: [deleteUserInput, deleteUserSubmitButton],
			events: {
				submit: (e: Event) => {
					const data = handleFormSubmit(e);
					if (!data) return;

					console.log('Form data:', data);
					
					ChatsController.deleteUser({ userName: data.username, chatId: this.props.selectedChatId as number });
					deleteUserModal.close();
				},
			},
		});

		const deleteUserModal = new Modal('dialog', {
			title: 'Удалить пользователя',
			modalChildren: [deleteUserForm],
		});

		this.children = {
			messageForm,
			searchForm,
			profileLink,
			createChatButton,
			createChatModal,
			dialogMenuButton,
			addUserButton,
			deleteUserButton,
			addUserModal,
			deleteUserModal,
		};

		if (chats.length) {
			this.lists = {
				chatList,
			};
		}

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
