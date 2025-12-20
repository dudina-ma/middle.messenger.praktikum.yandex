import './chats.scss';
import chatsTemplate from './chats.template';
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
import Chat from '../../components/chat/chat';
import { WebSocketClient } from '../../services/web-socket-client';
import { API_BASE_URLS } from '../../api/index';

interface ChatsPageProps {
	chats: ChatType[];
	selectedChatId: number | null;
	userId?: number;
}

class ChatsPage extends Block<ChatsPageProps> {
	private chatComponent: Chat | null = null;
	private webSocketClient: WebSocketClient | null = null;
	// типизация
	constructor(...args: ConstructorParameters<typeof Block<ChatsPageProps>>) {
		super(...args);

		ChatsController.getChats();
	}

	protected componentReceivesProps(nextProps: ChatsPageProps): void {
		if (nextProps.selectedChatId !== this.props.selectedChatId) {
			this.webSocketClient?.close();
			
			const chatId = nextProps.selectedChatId;

			if (!chatId) {
				return;
			}

			ChatsController.getChatToken(chatId)
				.then((token) => {
					const wsUrl = `${API_BASE_URLS.ws}/${this.props.userId}/${chatId}/${token}`;
					
					this.webSocketClient = new WebSocketClient(wsUrl);
					
					return this.webSocketClient.connect();
				})
				.then(() => {
					this.webSocketClient?.send({
						content: '0',
						type: 'get old',
					});
				})
				.catch((error) => {
					console.error('WebSocket connection error:', error);
				});
		}
	}

	public destroy() {
		super.destroy();

		this.webSocketClient?.close();
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
							this.setProps({
								selectedChatId: chat.id,
							});
						},
					},
					attr: {
						class: chat.id === this.props.selectedChatId ? 'chat-list-item chat-list-item--selected' : 'chat-list-item',
					},
				});
			});
		}

		if (this.props.selectedChatId) {
            const selectedChat = chats.find(c => c.id === this.props.selectedChatId);
            
            if (!this.chatComponent) {
                this.chatComponent = new Chat('section', {
                    chat: selectedChat as ChatType,
					attr: {
						class: 'chats-page__chat',
					},
                });
            } else {
                this.chatComponent.setProps({ chat: selectedChat });
            }
        } else {
            this.chatComponent = null;
        }


		
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



		this.children = {
			searchForm,
			profileLink,
			createChatButton,
			createChatModal,
			...(this.chatComponent && { chat: this.chatComponent }),	
		};

		if (chats.length) {
			this.lists = {
				chatList,
			};
		}

		return this.compile(chatsTemplate, this.props);
	}
}

function mapStateToProps(state: State) {
	return {
		chats: state.chats,
		userId: state.user?.id
	};
}

export default connect(mapStateToProps)(ChatsPage);
