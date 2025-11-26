import Block from '../../services/block';
import linkTemplate from './link.template';

export default class Link extends Block {
	render(): DocumentFragment {
		return this.compile(linkTemplate, this.props);
	}
}