import Block from '../../services/block';
import inputTemplate from './input.template';
import './input.scss';

export default class Input extends Block {
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