type ValidationRule = {
	rule: (value: string) => boolean;
	message: string;
};

export const validationRules: Record<string, ValidationRule[]> = {
	login: [
		{
			rule: (value: string) => value.length >= 3 && value.length <= 20,
			message: 'Логин должен быть от 3 до 20 символов',
		},
		{
			rule: (value: string) => /^[a-zA-Z0-9_-]+$/.test(value),
			message: 'Логин может содержать только латиницу, цифры, дефис и подчеркивание',
		},
		{
			rule: (value: string) => /[a-zA-Z]/.test(value),
			message: 'Логин не может состоять только из цифр',
		},
	],
	password: [
		{
			rule: (value: string) => value.length >= 8 && value.length <= 40,
			message: 'Пароль должен быть от 8 до 40 символов',
		},
		{
			rule: (value: string) => /[A-Z]/.test(value),
			message: 'Пароль должен содержать хотя бы одну заглавную букву',
		},
		{
			rule: (value: string) => /[0-9]/.test(value),
			message: 'Пароль должен содержать хотя бы одну цифру',
		},
	],
};

export function validateField(name: string, value: string): string | null {
	const rules = validationRules[name];
	if (!rules) {
		return null;
	}

	for (const { rule, message } of rules) {
		if (!rule(value)) {
			return message;
		}
	}

	return null;
}

export function validateForm(data: Record<string, string>): Record<string, string> {
	const errors: Record<string, string> = {};

	Object.entries(data).forEach(([name, value]) => {
		const error = validateField(name, value);
		if (error) {
			errors[name] = error;
		}
	});

	return errors;
}
