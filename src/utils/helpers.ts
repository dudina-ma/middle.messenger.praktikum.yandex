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
		const aValue = (a as Record<string, unknown>)[key];
		const bValue = (b as Record<string, unknown>)[key];
        
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

export function set(object: Indexed, path: string, value: unknown): Indexed {
	if (typeof path !== 'string') {
		throw new Error('path must be string');
	}

	if (object === null || typeof object !== 'object') {
		return object;
	}

	const pathItems = path.split('.');
    
	if (pathItems.length === 1) {
		object[pathItems[0]] = value;
		return object;
	}

	const key = pathItems[0];
	const restPath = pathItems.slice(1).join('.');
    
	if (object && !(key in object) || 
        typeof object[key] !== 'object' || 
        object[key] === null) {
		object[key] = {};
	}
    
	set(object[key] as Indexed, restPath, value);
    
	return object;
}
