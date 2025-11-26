export interface ProfileSetting {
  type: string;
  name: string;
  label: string;
  value: string;
}

export interface ProfileData {
  name: string;
  settings: ProfileSetting[];
}

export const profileData: ProfileData = {
	name: 'Иван',
	settings: [
		{
			type: 'email',
			name: 'email',
			label: 'Почта',
			value: 'ivan@example.com',
		},
		{
			type: 'text',
			name: 'login',
			label: 'Логин',
			value: 'ivan',
		},
		{
			type: 'text',
			name: 'first_name',
			label: 'Имя',
			value: 'Иван',
		},
		{
			type: 'text',
			name: 'second_name',
			label: 'Фамилия',
			value: 'Иванов',
		},
		{
			type: 'text',
			name: 'display_name',
			label: 'Имя в чате',
			value: 'Иван',
		},
		{
			type: 'tel',
			name: 'phone',
			label: 'Телефон',
			value: '+7 (909) 967 30 30',
		},
	],
};

