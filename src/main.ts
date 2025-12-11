import './styles/common.scss';
import Router from './services/router';
import ChatsPage from './pages/chats/chats';
import Error404Page from './pages/error404/error404';
import Error500Page from './pages/error500/error500';
import LoginPage from './pages/login/login';
import SignupPage from './pages/signup/signup';
import ProfilePage from './pages/profile/profile';

const router = new Router('#app');

router
	.use('/', LoginPage, {
		tagName: 'main',
		attr: { class: 'login-page' },
	})
	.use('/messenger', ChatsPage, { 
		tagName: 'main',
		attr: { class: 'chats-page' }, 
	})
	.use('/error404', Error404Page, { 
		tagName: 'main',
		attr: { class: 'error-page' }, 
	})
	.use('/error500', Error500Page, { 
		tagName: 'main',
		attr: { class: 'error-page' }, 
	})
	.use('/sign-up', SignupPage, {
		tagName: 'main',
		attr: { class: 'signup-page' },
	})
	.use('/settings', ProfilePage, {
		tagName: 'div',
		attr: { class: 'profile-page' },
	})
	.start();
