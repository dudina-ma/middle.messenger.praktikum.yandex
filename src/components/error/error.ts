import Block from '../../services/block';
import errorTemplate from './error.template';
import Link from '../link/link';
import Router from '../../services/router';

interface ErrorProps {
	code: string;
	message: string;
}
export default class Error extends Block<ErrorProps> {
	render(): DocumentFragment {
		const profileLink = new Link('a', {
			text: 'Назад к чатам',
			attr: {
				href: '/chats',
				class: 'error-page__link',
			},
			events: {
				click: (event: Event) => {
					event.preventDefault();

					const router = Router.getInstance();
					// else
					if (router) {
						router.go('/chats');
					}
				},
			},
		});

		this.children = {
			profileLink,
		};

		return this.compile(errorTemplate, this.props);
	}
}
