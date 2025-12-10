import Block from '../../services/block';
import linkTemplate from './link.template';

interface LinkProps {
	attr?: Record<string, string>;
	text?: string;
	events?: Record<string, (e: Event) => void>;
	icon?: boolean;
	iconText?: string;
	iconClass?: string;
}

export default class Link extends Block<LinkProps> {
	render(): DocumentFragment {
		return this.compile(linkTemplate, this.props);
	}
}
