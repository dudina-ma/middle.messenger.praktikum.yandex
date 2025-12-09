import './styles/common.scss';
import Router from './services/router';
import ChatsPage from './pages/chats/chats';
import Error404Page from './pages/error404/error404';
import Error500Page from './pages/error500/error500';

const router = new Router('#app');

router
//.use('/', LoginPage)
	.use('/chats', ChatsPage, { 
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
//.use('/signup', SignupPage)
//.use('/profile', ProfilePage)
//.use('/error500', Error500Page)
	.start();
