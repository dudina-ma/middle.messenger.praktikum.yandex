import EventBus from '../services/event-bus';

type Indexed<T = unknown> = {
    [key in string]: T;
};

export enum StoreEvents {
  Updated = 'updated',
}

function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
	if (typeof path !== 'string') {
		throw new Error('path must be string');
	}

	if (object === null || typeof object !== 'object') {
		return object;
	}

	const pathItems = path.split('.');
    
	if (pathItems.length === 1) {
		(object as any)[pathItems[0]] = value;
		return object;
	}

	const key = pathItems[0];
	const restPath = pathItems.slice(1).join('.');
    
	if (object && !(key in object) || 
        typeof (object as any)[key] !== 'object' || 
        (object as any)[key] === null) {
		(object as any)[key] = {};
	}
    
	set((object as any)[key], restPath, value);
    
	return object;
}

export interface State {
	user?: {
		id: number;
	};
}

class Store extends EventBus {
	private state: State = {};
  
	public getState() {
		return this.state;
	}
  
	public set(path: string, value: unknown) {
		set(this.state, path, value);

		this.emit(StoreEvents.Updated);
	};
}
  
export default new Store();
