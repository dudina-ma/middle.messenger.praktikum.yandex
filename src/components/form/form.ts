import Block from '../../services/block';
import formTemplate from './form.template';

interface FormProps {
	formChildren: Block<object>[];
	attr?: Record<string, string>;
	title?: string;
	titleClass?: string;
	events?: Record<string, (e: Event) => void>;
}

export default class Form extends Block<FormProps> {
	render(): DocumentFragment {
		return this.compile(formTemplate, this.props);
	}
}
