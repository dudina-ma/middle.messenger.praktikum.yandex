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

	_element: HTMLElement | null = null;
	_meta: { tagName: string, props: Props } | null = null;
	props: Props;
	eventBus: () => EventBus; 
	_id: string;
	children: Record<string, Block>;
	lists: Record<string, Block[]>;

	constructor(tagName: string = 'div', propsAndChilds: Props = {}) {
		const { children, props, lists } = this.getChildren(propsAndChilds);
		const eventBus = new EventBus();
		this._id = makeUUID();
		// _makePropsProxy
		this.children = children;
		// _makePropsProxy
		this.lists = lists;
		this.props = this._makePropsProxy({ ...props, __id: this._id });
		this._meta = {
			tagName,
			props,
		};

		this.props = this._makePropsProxy(props);
		this.eventBus = () => eventBus;

		this._registerEvents(eventBus);
		eventBus.emit(Block.EVENTS.INIT);
	}

	_registerEvents(eventBus: EventBus): void {
		eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
		eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDU, (...args: unknown[]) => {
			this._componentDidUpdate(args[0] as Props, args[1] as Props);
		});
	}

	_createResources() {
		if (!this._meta) {
			throw new Error('Meta is not defined');
		}
		const { tagName } = this._meta;
		this._element = this._createDocumentElement(tagName);
	}

	init() {
		this._createResources();
		this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
	}

	_componentDidMount() {
		this.componentDidMount();
	}

	// Может переопределять пользователь, необязательно трогать
	componentDidMount() {
	}

	dispatchComponentDidMount() {
		this.eventBus().emit(Block.EVENTS.FLOW_CDM);
	}

	_componentDidUpdate(oldProps: Props, newProps: Props) {
		const response = this.componentDidUpdate(oldProps, newProps);
		if (response) {
			this._render();
		} 
	}

	// Может переопределять пользователь, необязательно трогать
	componentDidUpdate(_oldProps: Props, _newProps: Props) {
		console.log(_oldProps, _newProps);
		return true;
	}

	setProps = (nextProps: Props) => {
		if (!nextProps) {
			return;
		}

		Object.assign(this.props, nextProps);
	};

	get element() {
		return this._element;
	}

	compile(template: string, props: Props) {
		// if (typeof props === 'undefined')
		// 	props = this._props;

		const propsAndStubs = { ...props };

		Object.entries(this.children).forEach(([key, child]) => {
			propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
		});

		Object.entries(this.lists).forEach(([key, list]) => {
			propsAndStubs[key] = list.map((item) => `<div data-id="${item._id}"></div>`);
		});

		const fragment = this._createDocumentElement('template') as HTMLTemplateElement;

		fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

		Object.values(this.children).forEach(child => {
			this._replaceStubWithContent(fragment.content, child);
		});

		Object.values(this.lists).forEach((list) => {
			list.forEach((item) => {
				this._replaceStubWithContent(fragment.content, item);
			});
		});

		return fragment.content;
	}

	_replaceStubWithContent(fragment: DocumentFragment, block: Block): void {
		const stub = fragment.querySelector(`[data-id="${block._id}"]`);
		
		if (stub) {
			const content = block.getContent();

			if (content) {
				stub.replaceWith(content);
			}
		}
	}

	_render() {
		if (!this._element) {
			throw new Error('Element is not created. Call init() first.');
		}

		const block = this.render();
		this._element.innerHTML = '';
		this._element.appendChild(block);

		this.addAttribute();
	}

	render(): DocumentFragment {
		return new DocumentFragment();
	}

	addAttribute() {
		if (!this.element) {
			throw new Error('Element is not created. Call init() first.');
		}

		const { attr = {} } = this.props as { attr: Record<string, string> };

		Object.entries(attr).forEach(([key, value]) => {
			this.element!.setAttribute(key, value);
		});
	}

	getContent() {
		return this.element;
	}

	getChildren(propsAndChilds: Props) {
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
	
	_makePropsProxy(props: Props) {

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


	_createDocumentElement(tagName: string) {
		// Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
		return document.createElement(tagName);
	}

	show() {
		if (this._element) {
			this._element.style.display = 'block';
		}
	}

	hide() {
		if (this._element) {
			this._element.style.display = 'none';
		}
	}
}