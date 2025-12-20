import './chat-list-item.scss';
import Block from '../../services/block';
import chatTemplate from './chat-list-item.template';
import type { Chat as ChatType } from '../../types/types';

interface ChatListItemProps {
	chatData: ChatType;
	attr?: Record<string, string>;
	events?: Record<string, (e: Event) => void>;
}

export default class ChatListItem extends Block<ChatListItemProps> {
	render(): DocumentFragment {
		return this.compile(chatTemplate, this.props);
	}
}
