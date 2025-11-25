import EventBus from './event-bus';
import Handlebars from 'handlebars';

type Props = Record<string, unknown>;

// TODO: переписать на uuid
function makeUUID() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default class Block {
	static EVENTS = {
		INIT: 'init',
		FLOW_CDM: 'flow:component-did-mount',
		FLOW_RENDER: 'flow:render',
		FLOW_CDU: 'flow:component-did-update',
	};

	private element: HTMLElement | null = null;
	private meta: { tagName: string, props: Props } | null = null;
	private id: string;
	private children: Record<string, Block>;
	private lists: Record<string, Block[]>;

	public props: Props;
	public eventBus: () => EventBus;

	constructor(tagName: string = 'div', propsAndChilds: Props = {}) {
		const { children, props, lists } = this.getChildren(propsAndChilds);
		const eventBus = new EventBus();
		this.id = makeUUID();
		// makePropsProxy
		this.children = children;
		// makePropsProxy
		this.lists = lists;
		this.props = this.makePropsProxy({ ...props, id: this.id });
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
			this.componentDidUpdateInternal(args[0] as Props, args[1] as Props);
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

	// Может переопределять пользователь, необязательно трогать
	public componentDidMount() {
	}

	public dispatchComponentDidMount() {
		this.eventBus().emit(Block.EVENTS.FLOW_CDM);
	}

	private componentDidUpdateInternal(oldProps: Props, newProps: Props) {
		const response = this.componentDidUpdate(oldProps, newProps);
		if (response) {
			this.renderInternal();
		} 
	}

	// Может переопределять пользователь, необязательно трогать
	public componentDidUpdate(_oldProps: Props, _newProps: Props) {
		console.log(_oldProps, _newProps);
		return true;
	}

	public setProps = (nextProps: Props) => {
		if (!nextProps) {
			return;
		}

		Object.assign(this.props, nextProps);
	};

	public compile(template: string, props: Props) {
		const propsAndStubs = { ...props };

		Object.entries(this.children).forEach(([key, child]) => {
			propsAndStubs[key] = `<div data-id="${child.id}"></div>`;
		});

		Object.entries(this.lists).forEach(([key, list]) => {
			propsAndStubs[key] = list.map((item) => `<div data-id="${item.id}"></div>`);
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

	private replaceStubWithContent(fragment: DocumentFragment, block: Block): void {
		const stub = fragment.querySelector(`[data-id="${block.id}"]`);
		
		if (stub) {
			const content = block.getContent();

			if (content) {
				stub.replaceWith(content);
			}
		}
	}

	private renderInternal() {
		if (!this.element) {
			throw new Error('Element is not created. Call init() first.');
		}

		const block = this.render();
		this.element.innerHTML = '';
		this.element.appendChild(block);

		this.addAttribute();
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

	private getChildren(propsAndChilds: Props) {
		const children: Record<string, Block> = {};
		const props: Props = {};
		const lists: Record<string, Block[]> = {};
	
		Object.keys(propsAndChilds).forEach(key => {
			if (propsAndChilds[key] instanceof Block)
				children[key] = propsAndChilds[key];
			else if (Array.isArray(propsAndChilds[key]))
				lists[key] = propsAndChilds[key];
			else
				props[key] = propsAndChilds[key];
		});
	
		return { children, props, lists };
	}
	
	private makePropsProxy(props: Props) {
		return new Proxy(props, {
			get(target: Props, prop: string) {
				const value = target[prop];
				return typeof value === 'function' ? value.bind(target) : value;
			},

			set: (target: Props, prop: string, value: unknown) => {
				const oldValue = { ...target };
				target[prop] = value;
				this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldValue, target);
				return true;
			},

			deleteProperty(target: Props, key: string) {
				throw new Error(`Нельзя удалить свойство ${key} из props`);
			},
		});
	}

	private createDocumentElement(tagName: string) {
		// Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
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