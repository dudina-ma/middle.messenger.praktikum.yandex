import Block from '../../services/block';
import buttonTemplate from './button.template';

interface ButtonProps {
	type: string;
	attr?: Record<string, string>;
	text?: string;
	icon?: boolean;
	iconClass?: string;
	events?: Record<string, (_event: Event) => void>;
}

export default class Button extends Block<ButtonProps> {
	render(): DocumentFragment {
		return this.compile(buttonTemplate, this.props);
	}
}
