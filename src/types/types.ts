export type Nullable<T> = T | null;

export type Indexed<T = unknown> = {
    [key in string]: T;
};

export interface SignupFormData {
	first_name: string;
	second_name: string;
	login: string;
	email: string;
	password: string;
	phone: string;
}

export interface LoginFormData {
	login: string;
	password: string;
}

// разообраться с опциональными полями
export interface User {
	id?: number;
	first_name: string;
	second_name: string;
	display_name: string;
	phone: string;
	login: string;
	avatar?: string;
	email: string;
}

export interface ChangePasswortdData {
	oldPassword: string;
	newPassword: string;
}