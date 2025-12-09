import './error404.scss';
import Error from '../../components/error/error';
import error404Template from './error404.template';
import Block from '../../services/block';

class Error404Page extends Block<object> {
	render() {
		const error = new Error('div', {
			code: '404',
			message: 'Не туда попали',
		});

		this.children = {
			error,
		};

		return this.compile(error404Template, { 
			error,
		});
	}
}

export default Error404Page;
