import Block from '../../services/block';
import formTemplate from './form.template';

export default class Form extends Block {
	render(): DocumentFragment {
		return this.compile(formTemplate, this.props);
	}
}