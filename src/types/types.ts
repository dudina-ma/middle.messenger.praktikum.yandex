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


export interface LastMessage {
	user: User;
	time: string; // ISO date string
	content: string;
}

export interface Chat {
	id: number;
	title: string;
	avatar: string;
	unread_count: number;
	created_by: number;
	last_message: LastMessage;
}

export interface Message {
	id: number;
	user_id: number;
	chat_id: number;
	content: string;
	file: string | null;
	is_read: boolean;
	time: string;
	type: string;
	isFromMe?: boolean;
}
