import Route from './route';
import type { Nullable } from '../types/types';
import type Block from './block';

type PageProps = {
	attr: Record<string, string>;
};

type PageConstructor = new (tagName?: string, props?: PageProps) => Block<object>;

type RouteProps = {
	tagName: string;
	attr: Record<string, string>;
};

class Router {
	private static instance: Router | undefined;
	private routes: Route[] = [];
	private history: History = window.history;
	private currentRoute: Nullable<Route> = null;
	private rootQuery!: string;
	private route404: Route | null = null;
	private readonly isUserAuthorizedFn: () => Promise<boolean>;

	constructor(rootQuery: string, isUserAuthorizedFn: () => Promise<boolean>) {
		this.rootQuery = rootQuery;
		this.isUserAuthorizedFn = isUserAuthorizedFn;

		if (Router.instance) {
			return Router.instance;
		}

		Router.instance = this;
	}

	static getInstance(): Router | null {
		return Router.instance || null;
	}

	static reset() {
		Router.instance = undefined;
	}

	public use(pathname: string, block: PageConstructor, props: RouteProps, isPrivate: boolean = false) {
		const route = new Route(pathname, block, { ...props, rootQuery: this.rootQuery }, isPrivate);
		this.routes.push(route);

		return this;
	}

	public on404(block: PageConstructor, props: RouteProps) {
		this.route404 = new Route('/fake-path', block, { ...props, rootQuery: this.rootQuery });

		return this;
	}

	public start() {
		window.onpopstate = () => {
			this.onRoute(window.location.pathname);
		};

		this.onRoute(window.location.pathname);
	}

	private async onRoute(pathname: string) {
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

		return this.isUserAuthorizedFn().then((isAuthorized) => {
			if (route.getIsPrivate() && !isAuthorized) {
				this.go('/');
				return;
			}

			this.currentRoute = route;

			route.render();
		});
	}

	public async go(pathname: string) {
		this.history.pushState({}, '', pathname);
		return this.onRoute(pathname);
	}

	public back() {
		this.history.back();
	}

	public forward() {
		this.history.forward();
	}

	public getRoute(pathname: string) {
		return this.routes.find(route => route.match(pathname));
	}
}

export default Router;
