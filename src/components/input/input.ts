import Block from '../../services/block';
import inputTemplate from './input.template';
import './input.scss';

export default class Input extends Block {
	render(): DocumentFragment {
		return this.compile(inputTemplate, this.props);
	}
}