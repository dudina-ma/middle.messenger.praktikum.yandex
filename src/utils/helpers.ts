import type { Indexed } from '../types/types';

export function isEqual(a: object, b: object): boolean {
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
    
	if (aKeys.length !== bKeys.length) {
		return false;
	}
    
	const bKeySet = new Set(bKeys);
	for (const key of aKeys) {
		if (!bKeySet.has(key)) {
			return false;
		}
	}
    
	for (const key of aKeys) {
		const aValue = (a as any)[key];
		const bValue = (b as any)[key];
        
		if (typeof aValue === 'object' && aValue !== null &&
            typeof bValue === 'object' && bValue !== null) {
            
			if (!isEqual(aValue, bValue)) {
				return false;
			}
		} 
		else if (typeof aValue !== 'object' && typeof bValue !== 'object') {
			if (aValue !== bValue) {
				return false;
			}
		}
		else {
			return false;
		}
	}
    
	return true;
}

export function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
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
