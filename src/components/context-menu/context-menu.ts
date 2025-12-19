import './context-menu.scss';
import Block from '../../services/block';
import contextMenuTemplate from './context-menu.template';

interface ContextMenuProps {
	menuItems?: Block<object>[];
	attr?: Record<string, string>;
	events?: Record<string, (e: Event) => void>;
}

export default class ContextMenu extends Block<ContextMenuProps> {
	show() {
		if (this.element) {
			this.element.style.display = 'flex';
		}
	}

	render(): DocumentFragment {
		return this.compile(contextMenuTemplate, this.props);
	}
}


