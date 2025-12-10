import './error500.scss';
import Error from '../../components/error/error';
import error500Template from './error500.template';
import Block from '../../services/block';
import Router from '../../services/router';
import Link from '../../components/link/link';

class Error500Page extends Block<object> {
	render() {
		const error = new Error('div', {
			code: '500',
			message: 'Мы уже фиксим',
		});

		const profileLink = new Link('a', {
			text: 'Назад к чатам',
			attr: {
				href: '/messenger',
				class: 'error-page__link',
			},
			events: {
				click: (event: Event) => {
					event.preventDefault();

					const router = Router.getInstance();
					// else
					if (router) {
						router.go('/messenger');
					}
				},
			},
		});
	
		this.children = {
			error,
			profileLink,
		};

		return this.compile(error500Template, { 
			error,
		});
	}
}

export default Error500Page;
