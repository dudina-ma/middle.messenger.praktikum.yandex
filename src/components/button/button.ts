import Block from '../../services/block';
import buttonTemplate from './button.template';

export default class Button extends Block {
	render(): DocumentFragment {
		return this.compile(buttonTemplate, this.props);
	}
}