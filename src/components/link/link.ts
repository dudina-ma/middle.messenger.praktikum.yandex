import Block from '../../services/block';
import linkTemplate from './link.template';

interface LinkProps {
	attr?: Record<string, string>;
	text: string;
}

export default class Link extends Block<LinkProps> {
	render(): DocumentFragment {
		return this.compile(linkTemplate, this.props);
	}
}
