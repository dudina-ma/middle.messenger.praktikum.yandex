import Route from './route';
import type { Nullable } from '../types/types';
import type Block from './block';
import store from '../store/store';

type PageProps = {
	attr: Record<string, string>;
};

type PageConstructor = new (tagName?: string, props?: PageProps) => Block<object>;

type RouteProps = {
	tagName: string;
	attr: Record<string, string>;
};

class Router {
	private static __instance: Router;
	private routes: Route[] = [];
	private history: History = window.history;
	private currentRoute: Nullable<Route> = null;
	private rootQuery!: string;
	private route404: Route | null = null;

	constructor(rootQuery: string) {
		if (Router.__instance) {
			return Router.__instance;
		}

		this.rootQuery = rootQuery;

		Router.__instance = this;
	}

	static getInstance(): Router | null {
		return Router.__instance || null;
	}

	use(pathname: string, block: PageConstructor, props: RouteProps, isPrivate: boolean = false) {
		const route = new Route(pathname, block, { ...props, rootQuery: this.rootQuery }, isPrivate);
		this.routes.push(route);

		return this;
	}

	on404(block: PageConstructor, props: RouteProps) {
		this.route404 = new Route('/fake-path', block, { ...props, rootQuery: this.rootQuery });

		return this;
	}

	start() {
		window.onpopstate = () => {
			this._onRoute(window.location.pathname);
		};

		this._onRoute(window.location.pathname);
	}

	_onRoute(pathname: string) {
		const route = this.getRoute(pathname);

		if (!route) {
			this.currentRoute?.leave();
			this.currentRoute = this.route404;
			this.route404?.render();
			return;
		}

		if (this.currentRoute && this.currentRoute !== route) {
			this.currentRoute.leave();
		}

		if (route.getIsPrivate() && !store.getState().user) {
			this.go('/');
			return;
		}

		this.currentRoute = route;

		route.render();
	}

	go(pathname: string) {
		this.history.pushState({}, '', pathname);
		this._onRoute(pathname);
	}

	back() {
		this.history.back();
	}

	forward() {
		this.history.forward();
	}

	getRoute(pathname: string) {
		return this.routes.find(route => route.match(pathname));
	}
}

export default Router;
