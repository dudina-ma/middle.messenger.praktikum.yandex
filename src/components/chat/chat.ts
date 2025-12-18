import './chat.scss';
import Block from '../../services/block';
import chatTemplate from './chat.template';
import type { Chat as ChatType} from '../../types/types';
import Input from '../input/input';
import Button from '../button/button';
import Form from '../form/form';
import { handleFormSubmit } from '../../utils/formHelpers';
import ChatsController from '../../controllers/chats-controller';
import Modal from '../modal/modal';

interface ChatProps {
	chat: ChatType;
	attr?: Record<string, string>;
	events?: Record<string, (e: Event) => void>;
}

export default class ChatsListItem extends Block<ChatProps> {
	render(): DocumentFragment {
		const contextMenuButton = new Button('button', {
			type: 'button',
			attr: {
				class: 'chat__context-menu-button',
			},
			icon: true,
			iconClass: 'chat__menu-button-icon',
		});

		const addUserButton = new Button('button', {
			type: 'button',
			attr: {
				class: 'chat__context-menu-item',
			},
			icon: true,
			iconClass: 'chat__context-menu-icon chat__context-menu-icon--add',
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
					
					ChatsController.addUser({ userName: data.username, chatId: this.props.chat.id });
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
				class: 'chat__context-menu-item',
			},
			icon: true,
			iconClass: 'chat__context-menu-icon chat__context-menu-icon--delete',
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
					
					ChatsController.deleteUser({ userName: data.username, chatId: this.props.chat.id });
					deleteUserModal.close();
				},
			},
		});

		const deleteUserModal = new Modal('dialog', {
			title: 'Удалить пользователя',
			modalChildren: [deleteUserForm],
		});

        const messageInput = new Input('div', {
			name: 'message',
			type: 'text',
			placeholder: 'Сообщение',
			class: 'chat__input',
			attr: {
				class: 'chat__message-field',
			},
		});
		
		const attachButton = new Button('button', {
			type: 'button',
			icon: true,
			iconClass: 'chat__message-attach-icon',
			attr: {
				class: 'chat__message-attach',
			},
		});
		
		const submitButton = new Button('button', {
			type: 'submit',
			icon: true,
			iconClass: 'chat__message-send-icon',
			attr: {
				class: 'chat__message-send',
			},
		});
		
		const messageForm = new Form('form', {
			attr: {
				class: 'chat__message-form',
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

        this.children = {
            messageForm,
            contextMenuButton,
			addUserButton,
			deleteUserButton,
			addUserModal,
			deleteUserModal,
        };


		return this.compile(chatTemplate, this.props);
	}
}