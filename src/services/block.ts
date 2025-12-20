import EventBus from './event-bus';
import Handlebars from 'handlebars';
import type { Nullable } from '../types/types';

type Events = Record<string, (e: Event) => void>;

function makeUUID() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default class Block<TProps extends object> {
	static EVENTS = {
		INIT: 'init',
		FLOW_CDM: 'flow:component-did-mount',
		FLOW_RENDER: 'flow:render',
		FLOW_CDU: 'flow:component-did-update',
	};

	private element: Nullable<HTMLElement> = null;
	private meta: Nullable<{ tagName: string, props: TProps }> = null;
	private id: string;
	private children: Record<string, Block<object>>;
	private lists: Record<string, Block<object>[]>;

	public props: TProps;
	public eventBus: () => EventBus;

	constructor(tagName: string = 'div', propsAndChilds: TProps = {} as TProps) {
		const { children, props, lists } = this.getChildren(propsAndChilds);
		const eventBus = new EventBus();
		this.id = makeUUID();
		this.children = children;
		this.lists = lists;
		this.props = this.makePropsProxy(props);
		this.meta = {
			tagName,
			props,
		};

		this.props = this.makePropsProxy(props);
		this.eventBus = () => eventBus;

		this.registerEvents(eventBus);
		eventBus.emit(Block.EVENTS.INIT);
	}

	private registerEvents(eventBus: EventBus): void {
		eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDM, this.componentDidMountInternal.bind(this));
		eventBus.on(Block.EVENTS.FLOW_RENDER, this.renderInternal.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDU, (...args: unknown[]) => {
			this.componentDidUpdateInternal(args[0] as TProps, args[1] as TProps);
		});
	}

	private createResources() {
		if (!this.meta) {
			throw new Error('Meta is not defined');
		}
		const { tagName } = this.meta;
		this.element = this.createDocumentElement(tagName);
	}

	private init() {
		this.createResources();
		this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
	}

	private componentDidMountInternal() {
		this.componentDidMount();
	}

	public componentDidMount() {
	}

	public dispatchComponentDidMount() {
		this.eventBus().emit(Block.EVENTS.FLOW_CDM);
	}

	private componentDidUpdateInternal(oldProps: TProps, newProps: TProps) {
		const response = this.componentDidUpdate(oldProps, newProps);
		if (response) {
			this.renderInternal();
		} 
	}

	public componentDidUpdate(_oldProps: TProps, _newProps: TProps) {
		return true;
	}

	public setProps = (nextProps: Partial<TProps>) => {
		if (!nextProps) {
			return;
		}

		Object.assign(this.props, nextProps);
	};

	public compile(template: string, props: TProps) {
		const propsAndStubs = { ...props };

		Object.entries(this.children).forEach(([key, child]) => {
			propsAndStubs[key as keyof TProps] = `<div data-id="${child.id}"></div>` as TProps[keyof TProps];
		});

		Object.entries(this.lists).forEach(([key, list]) => {
			propsAndStubs[key as keyof TProps] = list.map((item) => `<div data-id="${item.id}"></div>`) as TProps[keyof TProps];
		});

		const fragment = this.createDocumentElement('template') as HTMLTemplateElement;

		fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

		Object.values(this.children).forEach(child => {
			this.replaceStubWithContent(fragment.content, child);
		});

		Object.values(this.lists).forEach((list) => {
			list.forEach((item) => {
				this.replaceStubWithContent(fragment.content, item);
			});
		});

		return fragment.content;
	}

	private replaceStubWithContent(fragment: DocumentFragment, block: Block<object>): void {
		const stub = fragment.querySelector(`[data-id="${block.id}"]`);
		
		if (stub) {
			const content = block.getContent();

			if (content) {
				stub.replaceWith(content);
			}
		}
	}

	private addEvents() {
		const { events = {} } = this.props as { events: Events };

		if (!this.element) {
			return;
		}
	
		Object.keys(events).forEach((eventName) => {
			this.element!.addEventListener(eventName, events[eventName]);
		});
	}
	
	private removeEvents() {
		const { events = {} } = this.props as { events: Events };

		if (!this.element) {
			return;
		}
	
		Object.keys(events).forEach((eventName) => {
			this.element!.removeEventListener(eventName, events[eventName]);
		});
	}

	private renderInternal() {
		if (!this.element) {
			throw new Error('Element is not created. Call init() first.');
		}

		const block = this.render();
		this.removeEvents();
		this.element.innerHTML = '';
		this.element.appendChild(block);

		this.addAttribute();
		this.addEvents();
	}

	public render(): DocumentFragment {
		return new DocumentFragment();
	}

	private addAttribute() {
		if (!this.element) {
			throw new Error('Element is not created. Call init() first.');
		}

		const { attr = {} } = this.props as { attr: Record<string, string> };

		Object.entries(attr).forEach(([key, value]) => {
			this.element!.setAttribute(key, value);
		});
	}

	public getContent() {
		return this.element;
	}

	private getChildren(propsAndChildren: TProps) {
		const children: Record<string, Block<object>> = {};
		const props = {} as TProps;
		const lists: Record<string, Block<object>[]> = {};
		
		Object.keys(propsAndChildren).forEach(key => {
			const k = key as keyof TProps;

			if (propsAndChildren[k] instanceof Block)
				children[key] = propsAndChildren[k];
			else if (Array.isArray(propsAndChildren[k]) && propsAndChildren[k][0] instanceof Block)
				lists[key] = propsAndChildren[k];
			else
				props[k] = propsAndChildren[k];
		});
	
		return { children, props, lists };
	}
	
	private makePropsProxy(props: TProps): TProps {
		return new Proxy(props, {
			get(target: TProps, prop: string): TProps[keyof TProps] {
				const value = target[prop as keyof TProps];
				return typeof value === 'function' ? value.bind(target) : value;
			},

			set: (target: TProps, prop: string, value: unknown) => {
				const oldValue = { ...target };
				target[prop as keyof TProps] = value as TProps[keyof TProps];
				this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldValue, target);
				return true;
			},

			deleteProperty(_target: TProps, key: string) {
				throw new Error(`Нельзя удалить свойство ${key} из props`);
			},
		});
	}

	private createDocumentElement(tagName: string) {
		return document.createElement(tagName);
	}

	public show() {
		if (this.element) {
			this.element.style.display = 'block';
		}
	}

	public hide() {
		if (this.element) {
			this.element.style.display = 'none';
		}
	}
}
