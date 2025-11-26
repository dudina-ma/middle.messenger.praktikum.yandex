import './profile.scss';
import profileTemplate from './profile.template';
import { profileData } from '../../mock/profileData';
import Input from '../../components/input/input';
import Block from '../../services/block';
import render from '../../utils/render';
import Form from '../../components/form/form';
import Button from '../../components/button/button';
import { validateField, validateForm } from '../../services/validation';

const readonlyInputs: Input[] = profileData.settings.map((setting) => {
	return new Input('div', {
		type: setting.type,
		name: setting.name,
		label: setting.label,
		value: setting.value,
		readonly: true,
		class: 'input-field__input',
		attr: {
			class: 'input-field profile-page__setting-item',
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
			class: 'input-field profile-page__setting-item',
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
	events: {
		click: () => {
			profilePage.setProps({
				isEditData: false,
				isViewData: true,
			});
		},
	},
});

const profileViewForm = new Form('form', {
	attr: {
		class: 'profile-form',
	},
	class: 'profile-page__settings-list',
	formChildren: [...readonlyInputs],
});

const profileEditForm = new Form('form', {
	attr: {
		class: 'profile-form',
	},
	class: 'profile-page__settings-list',
	formChildren: [...editableInputs, submitButton],
	events: {
		focusout: (e: Event) => {
			if (!(e.target instanceof HTMLInputElement)) {
				return;
			}
			
			const target = e.target as HTMLInputElement;
			const name = target.name;
			const value = target.value;

			const errors = validateField(name, value);

			if (inputsByName[name]) {
				inputsByName[name].setProps({
					error: Boolean(errors),
					errorText: errors,
					value,
				});
			}
		},
		submit: (e: Event) => {
			e.preventDefault();
			const form = e.target as HTMLFormElement;
			const formData = new FormData(form);
			
			const data: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				data[key] = value.toString();
			}

			const errors = validateForm(data);

			readonlyInputs.forEach((input) => {
				const name = input.props.name as string;
				if (name) {
					input.setProps({
						error: Boolean(errors[name]),
						errorText: errors[name],
						value: data[name] || input.props.value,
					});
				}
			});

			console.log('Form data:', data);
		},
	},
});

class ProfilePage extends Block {
	render() {
		return this.compile(profileTemplate, {
			...this.props,
			profile: profileData,
			profileChangeDataButton,
		});
	}
}

const profilePage = new ProfilePage('div', {
	isViewData: true,
	isEditData: false,
	isPasswordChange: false,
	profileViewForm,
	profileEditForm,
	profileChangeDataButton,
	attr: { class: 'profile-page' },
});

render('#profile', profilePage);

