import './chat-list-item.scss';
import Block from '../../services/block';
import chatTemplate from './chat-list-item.template';
import type { Chat as ChatType} from '../../types/types';

interface ChatsListItemProps {
	chatData: ChatType;
	attr?: Record<string, string>;
	events?: Record<string, (e: Event) => void>;
	isSelected?: boolean;
}

export default class ChatsListItem extends Block<ChatsListItemProps> {
	render(): DocumentFragment {
		return this.compile(chatTemplate, this.props);
	}
}
