/**
 * Merge two objects
 * @param {object} oldObject
 * @param {object} newObject
 */
export const merge = (oldObject: object, newObject: object): object => {
	for (const prop in newObject) {
		(oldObject as any)[prop] = (newObject as any)[prop];
	}
	return oldObject;
};