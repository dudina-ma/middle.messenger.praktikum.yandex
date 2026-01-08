import EventBus from '../services/event-bus';
import type { User, Chat } from '../types/types';
import { ProfilePageMode } from '../controllers/user-controller';
import { set } from '../utils/helpers';
import type { Message, Indexed } from '../types/types';

export interface State {
	user?: User;
	profile?: {
		pageMode: ProfilePageMode;
	};
	chats?: Chat[];
	selectedChatId?: number;
	chatMessages?: Message[];
}

export enum StoreEvents {
  Updated = 'updated',
}

class Store extends EventBus {
	private state: State = {};

	public getState() {
		return this.state;
	}

	public set(path: string, value: unknown) {
		set(this.state as Indexed, path, value);

		this.emit(StoreEvents.Updated);
	};
}

export default new Store();
