import Block from '../../services/block';
import inputTemplate from './input.template';
import './input.scss';

interface InputProps {
	attr?: Record<string, string>;
	icon?: boolean;
	iconClass?: string;
	name: string;
	type: string;
	label?: string;
	value?: string;
	placeholder?: string;
	readonly?: boolean;
	required?: boolean;
	class?: string;
	error?: boolean;
	errorText?: string | null;
}

export default class Input extends Block<InputProps> {
	render(): DocumentFragment {
		const baseClass = (this.props.class as string) || '';
		const errorClass = this.props.error ? ' input-field__input--error' : '';
		const inputClass = `${baseClass}${errorClass}`.trim();

		const props = {
			...this.props,
			inputClass,
		};

		return this.compile(inputTemplate, props);
	}
}