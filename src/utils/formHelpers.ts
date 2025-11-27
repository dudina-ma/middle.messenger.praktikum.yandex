import Input from '../components/input/input';
import { validateField } from '../services/validation';

export function handleFormSubmit(e: Event): Record<string, string> | null {
	e.preventDefault();
	e.stopPropagation();
	
	const form = e.target as HTMLFormElement;
	if (!form) {
		return null;
	}
	
	const formData = new FormData(form);
	const data: Record<string, string> = {};
	
	for (const [key, value] of formData.entries()) {
		data[key] = value.toString();
	}
	
	return data;
}

export function handleInputFocusOut(
	e: Event,
	inputsByName: Record<string, Input>,
	additionalValidation?: (name: string, value: string, form: HTMLFormElement | null) => string | null,
): boolean {
	if (!(e.target instanceof HTMLInputElement)) {
		return false;
	}
	
	const target = e.target as HTMLInputElement;
	const name = target.name;
	const value = target.value;
	const form = target.form;

	let errors = validateField(name, value);

	if (additionalValidation) {
		const additionalError = additionalValidation(name, value, form);
		if (additionalError) {
			errors = additionalError;
		}
	}

	const input = inputsByName[name];
	if (input) {
		input.setProps({
			error: Boolean(errors),
			errorText: errors,
			value,
		});
	}

	return true;
}

export function validatePasswordMatch(
	name: string,
	value: string,
	form: HTMLFormElement | null,
	passwordFieldName: string,
	repeatedFieldName: string,
	triggerRepeatedValidation = false,
): string | null {
	if (!form) {
		return null;
	}

	if (name === repeatedFieldName) {
		const passwordInput = form.querySelector(`input[name="${passwordFieldName}"]`) as HTMLInputElement;
		if (passwordInput && value && value !== passwordInput.value) {
			return 'Пароли не совпадают';
		}
	}

	if (triggerRepeatedValidation && name === passwordFieldName) {
		const repeatedInput = form.querySelector(`input[name="${repeatedFieldName}"]`) as HTMLInputElement;
		if (repeatedInput && repeatedInput.value && value !== repeatedInput.value) {
			repeatedInput.dispatchEvent(new Event('focusout'));
		}
	}

	return null;
}

export function validatePasswordMatchOnSubmit(
	data: Record<string, string>,
	errors: Record<string, string>,
	passwordFieldName: string,
	repeatedFieldName: string,
): void {
	if (data[passwordFieldName] && data[repeatedFieldName] && data[passwordFieldName] !== data[repeatedFieldName]) {
		errors[repeatedFieldName] = 'Пароли не совпадают';
	}
}
