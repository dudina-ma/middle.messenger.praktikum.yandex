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
