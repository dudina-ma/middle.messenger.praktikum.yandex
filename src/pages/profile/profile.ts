import './profile.scss';
import profileTemplate from './profile.template';
import Input from '../../components/input/input';
import Block from '../../services/block';
import Form from '../../components/form/form';
import Button from '../../components/button/button';
import { validateForm } from '../../services/validation';
import { handleFormSubmit, handleInputFocusOut, validatePasswordMatch, validatePasswordMatchOnSubmit } from '../../utils/formHelpers';
import Link from '../../components/link/link';
import Router from '../../services/router';
import AuthController from '../../controllers/auth-controller';
import type { User, ChangePasswortdData } from '../../types/types';
import type { State } from '../../store/store';
import connect from '../../services/hoc';
import UserController from '../../controllers/user-controller';
import { ProfilePageMode } from '../../controllers/user-controller';
import Modal from '../../components/modal/modal';
import { API_BASE_URLS } from '../../api/index';

interface ProfilePageProps {
	profile: User;
	isViewData?: boolean;
	isEditData?: boolean;
	isPasswordChange?: boolean;
}

class ProfilePage extends Block<ProfilePageProps> {
	// типизация
	constructor(...args: ConstructorParameters<typeof Block<ProfilePageProps>>) {
		super(...args);

		UserController.setProfilePageMode(ProfilePageMode.VIEW_DATA);

		AuthController.getUser().then((user) => {
			this.setProps({
				profile: user,
			});
		});
		//UserController.setProfilePageMode(ProfilePageMode.VIEW_DATA);
	}

	render() {
		const user = this.props.profile;

		const changeAvatarButton = new Button('button', {
			type: 'button',
			content: 'Поменять аватар',
			contentClass: 'profile-page__avatar-text',
			attr: {
				class: 'profile-page__avatar',
			},
			events: {
				click: () => {
					changeAvatarModal.open();
				},
			},

		});

		if (user?.avatar) {
			const content = changeAvatarButton.getContent();
			
			if (content) {
				content.style.setProperty('--avatar-url', `url(${API_BASE_URLS.resources}${user.avatar})`);
			}
		}

		const changeAvatarInput = new Input('div', {
			type: 'file',
			name: 'avatar',
			label: 'Аватар',
			class: 'input-field__input profile-page__file-input',
			attr: {
				class: 'input-field profile-form__item profile-page__file-input-wrapper',
			},
		});

		const changeAvatarSubmitButton = new Button('button', {
			type: 'submit',
			text: 'Поменять',
			attr: {
				class: 'profile-form__button profile-page__change-avatar-submit-button',
			},
		});

		const changeAvatarForm = new Form('form', {
			attr: {
				class: 'profile-page__change-avatar-form',
			},
			formChildren: [changeAvatarInput, changeAvatarSubmitButton],
			events: {
				click: (e: Event) => {
					const target = e.target as HTMLElement;
					if (target.classList.contains('profile-page__file-trigger')) {
						e.preventDefault();
						e.stopPropagation();
						const fileInputWrapper = target.closest('.profile-page__file-input-wrapper');
						const fileInput = fileInputWrapper?.querySelector('input[type="file"]') as HTMLInputElement;
						if (fileInput) {
							fileInput.click();
						}
					}
				},
				submit: (e: Event) => {
					e.preventDefault();
					e.stopPropagation();
					
					const form = e.target as HTMLFormElement;
					if (!form) return;
					
					const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
					if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
						console.error('Файл не выбран');
						return;
					}
					
					const file = fileInput.files[0];

					UserController.changeAvatar(file);
					changeAvatarModal.close();

				},
			},
		});

		const changeAvatarModal = new Modal('dialog', {
			title: 'Загрузите файл',
			modalChildren: [changeAvatarForm],
			attr: {
				class: 'profile-page__change-avatar-modal',
			},
		});

		const emailInputReadonly = new Input('div', {
			type: 'email',
			name: 'email',
			label: 'Почта',
			value: user?.email || '',
			readonly: true,
			class: 'input-field__input',
			attr: {
				class: 'input-field profile-form__item',
			},
		});

		const loginInputReadonly = new Input('div', {
			type: 'text',
			name: 'login',
			label: 'Логин',
			value: user?.login || '',
			readonly: true,
			class: 'input-field__input',
			attr: {
				class: 'input-field profile-form__item',
			},
		});

		const firstNameInputReadonly = new Input('div', {
			type: 'text',
			name: 'first_name',
			label: 'Имя',
			value: user?.first_name || '',
			readonly: true,
			class: 'input-field__input',
			attr: {
				class: 'input-field profile-form__item',
			},
		});

		const secondNameInputReadonly = new Input('div', {
			type: 'text',
			name: 'second_name',
			label: 'Фамилия',
			value: user?.second_name || '',
			readonly: true,
			class: 'input-field__input',
			attr: {
				class: 'input-field profile-form__item',
			},
		});

		const displayNameInputReadonly = new Input('div', {
			type: 'text',
			name: 'display_name',
			label: 'Имя в чате',
			value: user?.display_name || '',
			readonly: true,
			class: 'input-field__input',
			attr: {
				class: 'input-field profile-form__item',
			},
		});

		const phoneInputReadonly = new Input('div', {
			type: 'tel',
			name: 'phone',
			label: 'Телефон',
			value: user?.phone || '',
			readonly: true,
			class: 'input-field__input',
			attr: {
				class: 'input-field profile-form__item',
			},
		});

		const readonlyInputs: Input[] = [
			emailInputReadonly,
			loginInputReadonly,
			firstNameInputReadonly,
			secondNameInputReadonly,
			displayNameInputReadonly,
			phoneInputReadonly,
		];

		const emailInputEditable = new Input('div', {
			type: 'email',
			name: 'email',
			label: 'Почта',
			value: user?.email || '',
			class: 'input-field__input',
			attr: {
				class: 'input-field profile-form__item',
			},
		});

		const loginInputEditable = new Input('div', {
			type: 'text',
			name: 'login',
			label: 'Логин',
			value: user?.login || '',
			class: 'input-field__input',
			attr: {
				class: 'input-field profile-form__item',
			},
		});

		const firstNameInputEditable = new Input('div', {
			type: 'text',
			name: 'first_name',
			label: 'Имя',
			value: user?.first_name || '',
			class: 'input-field__input',
			attr: {
				class: 'input-field profile-form__item',
			},
		});

		const secondNameInputEditable = new Input('div', {
			type: 'text',
			name: 'second_name',
			label: 'Фамилия',
			value: user?.second_name || '',
			class: 'input-field__input',
			attr: {
				class: 'input-field profile-form__item',
			},
		});

		const displayNameInputEditable = new Input('div', {
			type: 'text',
			name: 'display_name',
			label: 'Имя в чате',
			value: user?.display_name || '',
			class: 'input-field__input',
			attr: {
				class: 'input-field profile-form__item',
			},
		});

		const phoneInputEditable = new Input('div', {
			type: 'tel',
			name: 'phone',
			label: 'Телефон',
			value: user?.phone || '',
			class: 'input-field__input',
			attr: {
				class: 'input-field profile-form__item',
			},
		});

		const editableInputs: Input[] = [
			emailInputEditable,
			loginInputEditable,
			firstNameInputEditable,
			secondNameInputEditable,
			displayNameInputEditable,
			phoneInputEditable,
		];

		const editableInputsByName: Record<string, Input> = {
			email: emailInputEditable,
			login: loginInputEditable,
			first_name: firstNameInputEditable,
			second_name: secondNameInputEditable,
			display_name: displayNameInputEditable,
			phone: phoneInputEditable,
		};
		
		const profileChangeDataButton = new Button('button', {
			type: 'button',
			text: 'Изменить данные',
			attr: {
				class: 'profile-page__action-button',
			},
			events: {
				click: () => {
					UserController.setProfilePageMode(ProfilePageMode.EDIT_DATA);
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
					UserController.setProfilePageMode(ProfilePageMode.CHANGE_PASSWORD);
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

		const profileLogoutButton = new Button('button', {
			type: 'button',
			text: 'Выйти',
			attr: {
				class: 'profile-page__action-button profile-page__action-button--danger',
			},
			events: {
				click: () => {
					AuthController.logout();
				},
			},
		});
		
		const profileViewForm = new Form('form', {
			attr: {
				class: 'profile-form',
			},
			formChildren: [...readonlyInputs, profileLogoutButton],
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

						UserController.setProfilePageMode(ProfilePageMode.VIEW_DATA);
					}
					
					console.log('Form data:', data);

					const editProfileData: User = {
						first_name: data.first_name,
						second_name: data.second_name,
						login: data.login,
						email: data.email,
						phone: data.phone,
						display_name: data.display_name,
					};

					UserController.editProfile(editProfileData);
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
						UserController.setProfilePageMode(ProfilePageMode.VIEW_DATA);
					}
		
					console.log('Form data::', data);

					const changePasswordData: ChangePasswortdData = {
						oldPassword: data.oldPassword,
						newPassword: data.newPassword,
					};

					UserController.changePassword(changePasswordData);
				},
			},
		});

		const chatsBackLink = new Link('a', {
			attr: {
				href: '/messenger',
				class: 'profile-page__back-button',
			},
			icon: true,
			iconClass: 'profile-page__back-icon',
			events: {
				click: (event: Event) => {
					event.preventDefault();
					const router = Router.getInstance();
					if (router) {
						router.go('/messenger');
					}
				},
			},
		});

		this.children = {
			profileViewForm,
			profileEditForm,
			profilePasswordChangeForm,
			profileChangeDataButton,
			profileChangePasswordButton,
			profileLogoutButton,
			chatsBackLink,
			changeAvatarButton,
			changeAvatarModal,
		};

		return this.compile(profileTemplate, this.props);
	}
}

function mapStateToProps(state: State) {
	return {
	  profile: state.user,
	  isViewData: state.profile?.pageMode === ProfilePageMode.VIEW_DATA,
	  isEditData: state.profile?.pageMode === ProfilePageMode.EDIT_DATA,
	  isPasswordChange: state.profile?.pageMode === ProfilePageMode.CHANGE_PASSWORD,
	};
}

export default connect(mapStateToProps)(ProfilePage);
