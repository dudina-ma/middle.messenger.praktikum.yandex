import Block from '../services/block';

export default function render(rootSelector: string, block: Block) {

	const root = document.querySelector(rootSelector) as HTMLElement | null;

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