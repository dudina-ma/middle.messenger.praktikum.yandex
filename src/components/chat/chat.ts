import './chat.scss';
import Block from '../../services/block';
import chatTemplate from './chat.template';
import type { Chat as ChatType} from '../../types/types';

interface ChatProps {
	chatData: ChatType;
	attr?: Record<string, string>;
	events?: Record<string, (e: Event) => void>;
	isSelected?: boolean;
}

export default class Chat extends Block<ChatProps> {
	render(): DocumentFragment {
		return this.compile(chatTemplate, this.props);
	}
}
