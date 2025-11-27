import type { Nullable } from '../types/types';

type ValidationRule = {
	rule: (value: string) => boolean;
	message: string;
};

export const validationRules: Record<string, ValidationRule[]> = {
	first_name: [
		{
			rule: (value: string) => /^[А-ЯЁA-Z][а-яёa-zА-ЯЁA-Z-]*$/.test(value),
			message: 'Имя должно начинаться с заглавной буквы, содержать только латиницу или кириллицу, без пробелов, цифр и спецсимволов (кроме дефиса)',
		},
	],
	second_name: [
		{
			rule: (value: string) => /^[А-ЯЁA-Z][а-яёa-zА-ЯЁA-Z-]*$/.test(value),
			message: 'Фамилия должна начинаться с заглавной буквы, содержать только латиницу или кириллицу, без пробелов, цифр и спецсимволов (кроме дефиса)',
		},
	],
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
	email: [
		{
			rule: (value: string) => {
				if (!value.includes('@')) return false;
				const parts = value.split('@');
				if (parts.length !== 2) return false;
				const [localPart, domain] = parts;
				
				if (!/^[a-zA-Z0-9_-]+$/.test(localPart)) return false;
				
				if (!domain.includes('.')) return false;
				
				const domainBeforeDot = domain.split('.')[0];
				if (!/[a-zA-Z]/.test(domainBeforeDot)) return false;
				
				const domainAfterDot = domain.split('.').slice(1).join('.');
				if (!/[a-zA-Z]/.test(domainAfterDot)) return false;
				
				return true;
			},
			message: 'Email должен содержать латиницу, может включать цифры, дефис и подчеркивание, обязательно должна быть @ и точка после неё, перед точкой должны быть буквы',
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
	phone: [
		{
			rule: (value: string) => {
				const cleaned = value.startsWith('+') ? value.slice(1) : value;
				return cleaned.length >= 10 && cleaned.length <= 15;
			},
			message: 'Телефон должен быть от 10 до 15 символов',
		},
		{
			rule: (value: string) => {
				return /^\+?[0-9]+$/.test(value);
			},
			message: 'Телефон должен состоять из цифр и может начинаться с плюса',
		},
	],
};

export function validateField(name: string, value: string): Nullable<string> {
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
