import '../styles/error-alert.scss';

export function showErrorAlert(message: string): void {
	const existingAlert = document.querySelector('.error-alert');
	const existingOverlay = document.querySelector('.error-alert__overlay');
	if (existingAlert) {
		existingAlert.remove();
	}
	if (existingOverlay) {
		existingOverlay.remove();
	}

	const overlay = document.createElement('div');
	overlay.className = 'error-alert__overlay';

	const alert = document.createElement('div');
	alert.className = 'error-alert';

	const content = document.createElement('div');
	content.className = 'error-alert__content';

	const title = document.createElement('h2');
	title.className = 'error-alert__title';
	title.textContent = 'Ошибка';

	const messageEl = document.createElement('p');
	messageEl.className = 'error-alert__message';
	messageEl.textContent = message;

	const button = document.createElement('button');
	button.type = 'button';
	button.className = 'error-alert__button';
	button.textContent = 'OK';

	content.appendChild(title);
	content.appendChild(messageEl);
	content.appendChild(button);
	alert.appendChild(content);

	const closeAlert = () => {
		overlay.remove();
		alert.remove();
		document.removeEventListener('keydown', handleEscape);
	};

	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			closeAlert();
		}
	};

	button.addEventListener('click', closeAlert);
	overlay.addEventListener('click', (e) => {
		if (e.target === overlay) {
			closeAlert();
		}
	});

	document.addEventListener('keydown', handleEscape);

	document.body.appendChild(overlay);
	document.body.appendChild(alert);
}
