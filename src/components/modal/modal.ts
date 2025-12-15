import Block from '../../services/block';
import modalTemplate from './modal.template';
import './modal.scss';

interface ModalProps {
	formChildren?: Block<object>[];
	attr?: Record<string, string>;

	// скорее всего не понадобится
	onClose?: () => void;
	events?: Record<string, (e: Event) => void>;

	title?: string;
	titleClass?: string;
}

export default class Modal extends Block<ModalProps> {
	private dialogElement: HTMLDialogElement | null = null;

	constructor(tagName: string = 'dialog', propsAndChildren: ModalProps = {} as ModalProps) {
		super(tagName, propsAndChildren);

		const defaultEvents = {
			click: (e: Event) => {
				const target = e.target as HTMLElement;
				const dialogElement = this.getContent() as HTMLDialogElement;
				
				if (target === dialogElement) {
					this.close();
				}
			},
			close: () => {
				if (this.props.onClose) {
					this.props.onClose();
				}
			},
		};

		if (this.props.events) {
			this.props.events = { ...defaultEvents, ...this.props.events };
		} else {
			this.props.events = defaultEvents;
		}
	}

	close() {
		if (this.dialogElement) {
			this.dialogElement.close();
		}
	}

	open() {
		const element = this.getContent();
		if (element) {
			this.dialogElement = element as HTMLDialogElement;
			this.dialogElement.showModal();
		}
	}

	render(): DocumentFragment {
		return this.compile(modalTemplate, this.props);
	}
}
