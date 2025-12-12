import type Block from './block';
import { isEqual } from '../utils/helpers';
import render from '../utils/render';
import type { Nullable } from '../types/types';

type RouteProps = {
    rootQuery: string;
    tagName: string;
    attr: Record<string, string>;
};

type PageProps = {
	attr: Record<string, string>;
};

type PageConstructor = new (tagName?: string, props?: PageProps) => Block<object>;

class Route {
	private pathname: string;
	private pageClass: PageConstructor;
	private page: Nullable<Block<object>>;
	private props: RouteProps;

	constructor(pathname: string, pageClass: PageConstructor, props: RouteProps) {
		this.pathname = pathname;
		this.pageClass = pageClass;
		this.page = null;
		this.props = props;
	}

	navigate(pathname: string) {
		if (this.match(pathname)) {
			this.render();
		}
	}

	leave() {
		// else
		if (this.page) {
			this.page.destroy();
			this.page = null;
		}
	}

	match(pathname: string) {
		return pathname === this.pathname;
	}

	render() {
		if (!this.page) {
			this.page = new this.pageClass(this.props.tagName, { attr: this.props.attr });
			render(this.props.rootQuery, this.page);
			return;
		}
		//this.page.show();
	}
}

export default Route;
