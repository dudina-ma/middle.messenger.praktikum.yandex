import './error404.scss';
import Error from '../../components/error/error';
import error404Template from './error404.template';
import Block from '../../services/block';
import Link from '../../components/link/link';
import Router from '../../services/router';

class Error404Page extends Block<object> {
	render() {
		const error = new Error('div', {
			code: '404',
			message: 'Не туда попали',
			attr: {
				class: 'error',
			},
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
			profileLink
		};

		return this.compile(error404Template, { 
			error,
			profileLink,
		});
	}
}

export default Error404Page;
