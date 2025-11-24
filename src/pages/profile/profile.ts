import './profile.scss';
import profileTemplate from './profile.template';
import { profileData } from '../../mock/profileData';
import Input from '../../components/input/input';
import Block from '../../services/block';
import render from '../../utils/render';

const inputComponents: Input[] = profileData.settings.map((setting) => {
	return new Input('div', {
		type: setting.type,
		name: setting.name,
		label: setting.label,
		value: setting.value,
		readonly: setting.readonly,
		class: 'input-field__input',
		attr: {
			class: 'input-field',
		},
	});
});

class ProfilePage extends Block {
	render() {
		return this.compile(profileTemplate, {
			inputComponents,
			profile: profileData,
		});
	}
}

const profilePage = new ProfilePage('div', {
	inputComponents,
	attr: { class: 'profile-page' },
});

render('#profile', profilePage);

