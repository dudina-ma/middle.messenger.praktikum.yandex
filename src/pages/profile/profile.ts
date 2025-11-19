import './profile.scss';
import Handlebars from 'handlebars';
import profileTemplate from './profile.template';
import inputTemplate from '../../components/partials/input.template';
import { profileData } from '../../mock/profileData';

Handlebars.registerPartial('input', inputTemplate);

document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('#profile');

    const template = Handlebars.compile(profileTemplate);

    const result = template({ profile: profileData });

    if (root) {
        root.innerHTML = result;
    }
});

