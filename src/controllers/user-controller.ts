import UserAPI from '../api/user/user-api';
import store from '../store/store';
import type { User } from '../types/types';

// где должен быть этот enum
export enum ProfilePageMode {
	VIEW_DATA = 'view_data',
	EDIT_DATA = 'edit_data',
	CHANGE_PASSWORD = 'change_password',
}

class UserController {
    public setProfilePageMode(mode: ProfilePageMode) {
        store.set('profile.pageMode', mode);
    }

    public editProfile(data: User) {
        return UserAPI.editProfile(data)
            .then((xhr) => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText || '{}');
                    store.set('user', response);
                    return response;
                }
            });
    }
}

export default new UserController();
