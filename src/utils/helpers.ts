import type { Indexed } from '../types/types';

export function isEqual(a: object, b: object): boolean {
	let result: boolean = true;

	if (Object.keys(a).length !== Object.keys(b).length) {
		result = false;
	}

	const bKeys = new Set(Object.keys(b));

	for (let i = 0; i < Object.keys(a).length; i++) {
		if (bKeys.has(Object.keys(a)[i])) {
			bKeys.delete(Object.keys(a)[i]);
		} else {
			result = false;
			return result;
		}
	}

	if (bKeys.size > 0) {
		result = false;
		return result;
	}

	for (let i = 0; i < Object.keys(a).length; i++) {
		const aValue = (a as Indexed)[Object.keys(a)[i]];
		const bValue = (b as Indexed)[Object.keys(a)[i]];

		if (typeof aValue === 'object') {
			if (typeof bValue === 'object') {
				return isEqual(aValue as Indexed, bValue as Indexed);
			} else {
				result = false;
				return result;
			}
		} else {
			if (typeof bValue === 'object') {
				result = false;
				return result;
			} else {
				return aValue === bValue;
			}
		} 
	}

	return result;
}
