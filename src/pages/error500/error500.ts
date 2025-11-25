import './error500.scss';
import Error from '../../components/error/error';
import error500Template from './error500.template';
import render from '../../utils/render';
import Block from '../../services/block';

const error = new Error('div', {
	code: '500',
	message: 'Мы уже фиксим',
});

class Error500Page extends Block {
	render() {
		return this.compile(error500Template, { 
			error,
		});
	}
}

const error500Page = new Error500Page('div', {
	error,
});

render('#error500', error500Page);
