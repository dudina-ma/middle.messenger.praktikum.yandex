import Block from '../../services/block';
import errorTemplate from './error.template';

export default class Error extends Block {
	render(): DocumentFragment {
		return this.compile(errorTemplate, this.props);
	}
}
