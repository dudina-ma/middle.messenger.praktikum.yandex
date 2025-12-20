import './error404.scss';
import Error from '../../components/error/error';
import error404Template from './error404.template';
import render from '../../utils/render';
import Block from '../../services/block';

const error = new Error('div', {
	code: '404',
	message: 'Не туда попали',
});

interface Error404PageProps {
	error: Error;
}

class Error404Page extends Block<Error404PageProps> {
	render() {
		return this.compile(error404Template, { 
			error,
		});
	}
}

const error404Page = new Error404Page('div', {
	error,
});

render('#error404', error404Page);
