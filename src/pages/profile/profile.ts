import './profile.scss';
import profileTemplate from './profile.template';
import { profileData } from '../../mock/profileData';
import Input from '../../components/input/input';
import Block from '../../services/block';
import render from '../../utils/render';
import Form from '../../components/form/form';
import Button from '../../components/button/button';
import { validateField, validateForm } from '../../services/validation';

const inputComponents: Input[] = profileData.settings.map((setting) => {
	return new Input('div', {
		type: setting.type,
		name: setting.name,
		label: setting.label,
		value: setting.value,
		readonly: setting.readonly,
		class: 'input-field__input',
		attr: {
			class: 'input-field profile-page__setting-item',
		},
	});
});

const inputsByName: Record<string, Input> = {};
inputComponents.forEach((input) => {
	const name = input.props.name as string;
	if (name) {
		inputsByName[name] = input;
	}
});

const submitButton = new Button('button', {
	type: 'submit',
	text: 'Сохранить',
	attr: {
		class: 'profile-form__button',
	},
});

const profileForm = new Form('form', {
	attr: {
		class: 'profile-form',
	},
	class: 'profile-page__settings-list',
	formChildren: [...inputComponents, submitButton],
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

			inputComponents.forEach((input) => {
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
			profileForm,
			profile: profileData,
		});
	}
}

const profilePage = new ProfilePage('div', {
	profileForm,
	attr: { class: 'profile-page' },
});

render('#profile', profilePage);

