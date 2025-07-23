/**
 * @method merge
 * @description Merge two objects
 * @param {object} oldObject - The object to merge into
 * @param {object} newObject - The object to merge from
 * @returns {object} The merged object
 */
export const merge = (oldObject: object, newObject: object): object => {
	for (const prop in newObject) {
		(oldObject as any)[prop] = (newObject as any)[prop];
	}
	return oldObject;
};