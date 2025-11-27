import './profile.scss';
import profileTemplate from './profile.template';
import { profileData } from '../../mock/profileData';
import Input from '../../components/input/input';
import Block from '../../services/block';
import render from '../../utils/render';
import Form from '../../components/form/form';
import Button from '../../components/button/button';
import { validateForm } from '../../services/validation';
import { handleFormSubmit, handleInputFocusOut, validatePasswordMatch, validatePasswordMatchOnSubmit } from '../../utils/formHelpers';

const readonlyInputs: Input[] = profileData.settings.map((setting) => {
	return new Input('div', {
		type: setting.type,
		name: setting.name,
		label: setting.label,
		value: setting.value,
		readonly: true,
		class: 'input-field__input',
		attr: {
			class: 'input-field profile-form__item',
		},
	});
});

const editableInputs: Input[] = profileData.settings.map((setting) => {
	return new Input('div', {
		type: setting.type,
		name: setting.name,
		label: setting.label,
		value: setting.value,
		class: 'input-field__input',
		attr: {
			class: 'input-field profile-form__item',
		},
	});
});

const inputsByName: Record<string, Input> = {};
readonlyInputs.forEach((input) => {
	const name = input.props.name as string;
	if (name) {
		inputsByName[name] = input;
	}
});

const editableInputsByName: Record<string, Input> = {};
editableInputs.forEach((input) => {
	const name = input.props.name as string;
	if (name) {
		editableInputsByName[name] = input;
	}
});

const profileChangeDataButton = new Button('button', {
	type: 'button',
	text: 'Изменить данные',
	attr: {
		class: 'profile-page__action-button',
	},
	events: {
		click: () => {
			profilePage.setProps({
				isEditData: true,
				isViewData: false,
				isPasswordChange: false,
			});
		},
	},
});

const profileChangePasswordButton = new Button('button', {
	type: 'button',
	text: 'Изменить пароль',
	attr: {
		class: 'profile-page__action-button',
	},
	events: {
		click: () => {
			profilePage.setProps({
				isPasswordChange: true,
				isViewData: false,
				isEditData: false,
			});
		},
	},
});

const submitButton = new Button('button', {
	type: 'submit',
	text: 'Сохранить',
	attr: {
		class: 'profile-form__button',
	},
});

const profileViewForm = new Form('form', {
	attr: {
		class: 'profile-form',
	},
	formChildren: [...readonlyInputs],
});

const profileEditForm = new Form('form', {
	attr: {
		class: 'profile-form',
	},
	formChildren: [...editableInputs, submitButton],
	events: {
		focusout: (e: Event) => {
			handleInputFocusOut(e, editableInputsByName);
		},
		submit: (e: Event) => {
			const data = handleFormSubmit(e);
			if (!data) return;

			const errors = validateForm(data);

			editableInputs.forEach((input) => {
				const name = input.props.name as string;
				if (name) {
					input.setProps({
						error: Boolean(errors[name]),
						errorText: errors[name],
						value: data[name] || input.props.value,
						readonly: false,
					});
				}
			});

			const hasErrors = Object.values(errors).some(error => Boolean(error));
			
			if (!hasErrors) {
				readonlyInputs.forEach((input) => {
					const name = input.props.name as string;
					if (name && data[name]) {
						input.setProps({
							value: data[name],
							readonly: true,
						});
					}
				});
							
				profilePage.setProps({
					isEditData: false,
					isViewData: true,
					isPasswordChange: false,
				});
			}
			
			console.log('Form data:', data);
		},
	},
});

const oldPasswordInput = new Input('div', {
	type: 'password',
	name: 'oldPassword',
	label: 'Старый пароль',
	class: 'input-field__input',
	attr: {
		class: 'input-field profile-form__item',
	},
});

const newPasswordInput = new Input('div', {
	type: 'password',
	name: 'newPassword',
	label: 'Новый пароль',
	class: 'input-field__input',
	attr: {
		class: 'input-field profile-form__item',
	},
});

const repeatPasswordInput = new Input('div', {
	type: 'password',
	name: 'repeatPassword',
	label: 'Повторите новый пароль',
	class: 'input-field__input',
	attr: {
		class: 'input-field profile-form__item',
	},
});

const passwordSubmitButton = new Button('button', {
	type: 'submit',
	text: 'Сохранить',
	attr: {
		class: 'profile-form__button',
	},
});

const passwordInputsByName: Record<string, Input> = {
	oldPassword: oldPasswordInput,
	newPassword: newPasswordInput,
	repeatPassword: repeatPasswordInput,
};

const profilePasswordChangeForm = new Form('form', {
	attr: {
		class: 'profile-form',
	},
	formChildren: [oldPasswordInput, newPasswordInput, repeatPasswordInput, passwordSubmitButton],
	events: {
		focusout: (e: Event) => {
			handleInputFocusOut(e, passwordInputsByName, (name, value, form) => {
				return validatePasswordMatch(name, value, form, 'newPassword', 'repeatPassword');
			});
		},
		submit: (e: Event) => {
			const data = handleFormSubmit(e);
			if (!data) return;

			const errors = validateForm(data);

			validatePasswordMatchOnSubmit(data, errors, 'newPassword', 'repeatPassword');

			Object.keys(passwordInputsByName).forEach((name) => {
				const input = passwordInputsByName[name];
				input.setProps({
					error: Boolean(errors[name]),
					errorText: errors[name],
					value: data[name] || '',
				});
			});

			const hasErrors = Object.values(errors).some(error => Boolean(error));
			if (!hasErrors && data.newPassword && data.repeatPassword && data.newPassword === data.repeatPassword) {
				profilePage.setProps({
					isPasswordChange: false,
					isViewData: true,
					isEditData: false,
				});
			}

			console.log('Password change data:', data);
		},
	},
});

interface ProfilePageProps {
	isViewData: boolean;
	isEditData: boolean;
	isPasswordChange: boolean;
	profileViewForm: Form;
	profileEditForm: Form;
	profileChangeDataButton: Button;
	profileChangePasswordButton: Button;
	profilePasswordChangeForm: Form;
	profile: typeof profileData;
	attr?: Record<string, string>;
}

class ProfilePage extends Block<ProfilePageProps> {
	render() {
		return this.compile(profileTemplate, {
			...this.props,
			profile: profileData,
			profileChangeDataButton,
			profileChangePasswordButton,
		});
	}
}

const profilePage = new ProfilePage('div', {
	isViewData: true,
	isEditData: false,
	isPasswordChange: false,
	profileViewForm,
	profileEditForm,
	profilePasswordChangeForm,
	profileChangeDataButton,
	profileChangePasswordButton,
	attr: { class: 'profile-page' },
	profile: profileData,
});

render('#profile', profilePage);

