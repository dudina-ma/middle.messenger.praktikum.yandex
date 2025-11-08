export interface ProfileSetting {
  type: string;
  name: string;
  label: string;
  value: string;
  readonly: boolean;
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
      readonly: true,
    },
    {
      type: 'text',
      name: 'login',
      label: 'Логин',
      value: 'ivan',
      readonly: true,
    },
    {
      type: 'text',
      name: 'first_name',
      label: 'Имя',
      value: 'Иван',
      readonly: true,
    },
    {
      type: 'text',
      name: 'second_name',
      label: 'Фамилия',
      value: 'Иванов',
      readonly: true,
    },
    {
      type: 'text',
      name: 'display_name',
      label: 'Имя в чате',
      value: 'Иван',
      readonly: true,
    },
    {
      type: 'tel',
      name: 'phone',
      label: 'Телефон',
      value: '+7 (909) 967 30 30',
      readonly: true,
    },
  ],
};

