import Block from '../services/block';
import type { Nullable } from '../types/types';

export default function render(rootSelector: string, block: Block<object>) {

	const root = document.querySelector(rootSelector) as Nullable<HTMLElement>;

	if (!root) {
		throw new Error(`Root element not found: ${rootSelector}`);
	}

	const content = block.getContent();
	if (!content) {
		throw new Error('Block content is not initialized. Call init() first.');
	}

	root.appendChild(content);

	block.dispatchComponentDidMount();

	return root;
}
