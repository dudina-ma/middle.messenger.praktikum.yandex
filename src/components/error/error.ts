import Block from '../../services/block';
import errorTemplate from './error.template';

interface ErrorProps {
	code: string;
	message: string;
}
export default class Error extends Block<ErrorProps> {
	render(): DocumentFragment {
		return this.compile(errorTemplate, this.props);
	}
}
