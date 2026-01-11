import Router from './router';
import Block from './block';

const rootQuery = '#test';

class TestPage extends Block<object> {
	render(): DocumentFragment {
		return this.compile('<div>Test</div>', {});
	}
}

class TestPage2 extends Block<object> {
	render(): DocumentFragment {
		return this.compile('<div>Test2</div>', {});
	}
}

class Test404Page extends Block<object> {
	render(): DocumentFragment {
		return this.compile('<div>404</div>', {});
	}
}

describe('Router - Basic Navigation', () => {
	let router: Router;

	beforeEach(() => {
		const rootElement = document.createElement('div');
		rootElement.id = 'test';
		document.body.appendChild(rootElement);

		router = new Router(rootQuery, () => {
			return Promise.resolve(true);
		});

		router
			.use('/test', TestPage, {
				tagName: 'main',
				attr: { class: 'test-page' },
			}, false)
			.use('/test2', TestPage2, {
				tagName: 'main',
				attr: { class: 'test-page-2' },
			}, false)
			.on404(Test404Page, {
				tagName: 'main',
				attr: { class: 'error-page' },
			})
			.start();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		Router.reset();
	});

	it('should render test page', async () => {
		await router.go('/test');

		const rootElement = document.querySelector('#test');
		expect(rootElement?.innerHTML).toContain('<div>Test</div>');
	});

    it('should render test page2', async () => {
		await router.go('/test2');

		const rootElement = document.querySelector('#test');
		expect(rootElement?.innerHTML).toContain('<div>Test2</div>');
	});

    it('should render 404 page', async () => {
		await router.go('/test3');

		const rootElement = document.querySelector('#test');
		expect(rootElement?.innerHTML).toContain('<div>404</div>');
	});
});

describe('Router - History API', () => {
	let mockHistory: any;

	beforeEach(() => {
	  mockHistory = {
		pushState: jest.fn(),
		back: jest.fn(),
		forward: jest.fn(),
		length: 1,
		state: null,
	  };

	  Object.defineProperty(window, 'history', {
		writable: true,
		value: mockHistory,
	  });
	});

	afterEach(() => {
		Router.reset();
	});

	it('should call pushState when go() is called', async () => {
	  const router = new Router('#test', () => Promise.resolve(true));
	  await router.go('/test');

	  expect(mockHistory.pushState).toHaveBeenCalledWith({}, '', '/test');
	});

	it('should call back() when back() is called', () => {
	  const router = new Router('#test', () => Promise.resolve(true));
	  router.back();

	  expect(mockHistory.back).toHaveBeenCalled();
	});

	it('should call forward() when forward() is called', () => {
	  const router = new Router('#test', () => Promise.resolve(true));
	  router.forward();

	  expect(mockHistory.forward).toHaveBeenCalled();
	});
  });

describe('Router - Private Routes', () => {
	let router: Router;
	let isAuthorized: boolean;

	beforeEach(() => {
		const rootElement = document.createElement('div');
		rootElement.id = 'test';
		document.body.appendChild(rootElement);

		router = new Router(rootQuery, () => {
			return Promise.resolve(isAuthorized);
		});

		router
			.use('/', TestPage, {
				tagName: 'main',
				attr: { class: 'test-page' },
			}, false)
			.use('/private', TestPage2, {
				tagName: 'main',
				attr: { class: 'test-page-2' },
			}, true)
			.on404(Test404Page, {
				tagName: 'main',
				attr: { class: 'error-page' },
			})
			.start();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		Router.reset();
		isAuthorized = false;
	});

	it('should redirect to / when accessing private route without authorization', async () => {
		isAuthorized = false;

		await router.go('/private');

		const rootElement = document.querySelector('#test');
		expect(rootElement?.innerHTML).toContain('<div>Test</div>');
		expect(rootElement?.innerHTML).not.toContain('<div>Test2</div>');
	});

	it('should render private route when user is authorized', async () => {
		isAuthorized = true;

		await router.go('/private');

		const rootElement = document.querySelector('#test');
		expect(rootElement?.innerHTML).toContain('<div>Test2</div>');
	});

	it('should render public route when user is not authorized', async () => {
		isAuthorized = false;

		await router.go('/');

		const rootElement = document.querySelector('#test');
		expect(rootElement?.innerHTML).toContain('<div>Test</div>');
	});

	it('should render public route when user is authorized', async () => {
		isAuthorized = true;

		await router.go('/');

		const rootElement = document.querySelector('#test');
		expect(rootElement?.innerHTML).toContain('<div>Test</div>');
	});
});

describe('Router - Singleton Pattern', () => {
	beforeEach(() => {
		Router.reset();
	});

	afterEach(() => {
		Router.reset();
	});

	it('should return the same instance when creating multiple routers', () => {
		const rootElement = document.createElement('div');
		rootElement.id = 'test';
		document.body.appendChild(rootElement);

		const router1 = new Router('#test', () => Promise.resolve(true));
		const router2 = new Router('#test', () => Promise.resolve(true));

		expect(router1).toBe(router2);
		expect(Router.getInstance()).toBe(router1);
	});

	it('should return null when getInstance is called before router creation', () => {
		Router.reset();
		expect(Router.getInstance()).toBeNull();
	});

	it('should reset instance correctly', () => {
		const rootElement = document.createElement('div');
		rootElement.id = 'test';
		document.body.appendChild(rootElement);

		const router1 = new Router('#test', () => Promise.resolve(true));
		Router.reset();
		const router2 = new Router('#test', () => Promise.resolve(true));

		expect(router1).not.toBe(router2);
	});
});

describe('Router - Method Chaining', () => {
	beforeEach(() => {
		const rootElement = document.createElement('div');
		rootElement.id = 'test';
		document.body.appendChild(rootElement);
	});

	afterEach(() => {
		document.body.innerHTML = '';
		Router.reset();
	});

	it('should support method chaining for use()', () => {
		const router = new Router(rootQuery, () => Promise.resolve(true));
		const result = router
			.use('/test', TestPage, { tagName: 'main', attr: {} }, false)
			.use('/test2', TestPage2, { tagName: 'main', attr: {} }, false);

		expect(result).toBe(router);
	});

	it('should support method chaining for on404()', () => {
		const router = new Router(rootQuery, () => Promise.resolve(true));
		const result = router.on404(Test404Page, {
			tagName: 'main',
			attr: { class: 'error-page' },
		});

		expect(result).toBe(router);
	});
});

describe('Router - getRoute Method', () => {
	let router: Router;

	beforeEach(() => {
		const rootElement = document.createElement('div');
		rootElement.id = 'test';
		document.body.appendChild(rootElement);

		router = new Router(rootQuery, () => Promise.resolve(true));

		router
			.use('/test', TestPage, {
				tagName: 'main',
				attr: { class: 'test-page' },
			}, false)
			.use('/test2', TestPage2, {
				tagName: 'main',
				attr: { class: 'test-page-2' },
			}, false);
	});

	afterEach(() => {
		document.body.innerHTML = '';
		Router.reset();
	});

	it('should return route for existing pathname', () => {
		const route = router.getRoute('/test');
		expect(route).toBeDefined();
		expect(route).not.toBeNull();
	});

	it('should return undefined for non-existing pathname', () => {
		const route = router.getRoute('/nonexistent');
		expect(route).toBeUndefined();
	});
});

describe('Router - Error Handling', () => {
	let router: Router;

	beforeEach(() => {
		const rootElement = document.createElement('div');
		rootElement.id = 'test';
		document.body.appendChild(rootElement);
	});

	afterEach(() => {
		document.body.innerHTML = '';
		Router.reset();
	});

	it('should handle errors in isUserAuthorizedFn', async () => {
		const errorFn = jest.fn(() => Promise.reject(new Error('Auth error')));
		router = new Router(rootQuery, errorFn);

		router
			.use('/test', TestPage, {
				tagName: 'main',
				attr: { class: 'test-page' },
			}, false)
			.start();

		await expect(router.go('/test')).rejects.toThrow('Auth error');
	});

	it('should handle 404 when route404 is not set', async () => {
		router = new Router(rootQuery, () => Promise.resolve(true));

		router
			.use('/test', TestPage, {
				tagName: 'main',
				attr: { class: 'test-page' },
			}, false)
			.start();

		await router.go('/nonexistent');

		const rootElement = document.querySelector('#test');
		expect(rootElement).toBeDefined();
	});
});

