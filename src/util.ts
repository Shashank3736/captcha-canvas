/**
 * Merges properties from a new object into an existing object.
 * 
 * This utility function performs a shallow merge, copying all enumerable properties
 * from the new object to the old object. It's used internally to merge user-provided
 * options with default configurations.
 * 
 * @param oldObject - The target object to merge properties into
 * @param newObject - The source object containing properties to merge
 * @returns The modified target object with merged properties
 * 
 * @example
 * ```typescript
 * const defaults = { color: 'blue', size: 40, opacity: 0.8 };
 * const userOptions = { color: 'red', size: 60 };
 * 
 * const merged = merge(defaults, userOptions);
 * // Result: { color: 'red', size: 60, opacity: 0.8 }
 * ```
 * 
 * @example Type-safe usage
 * ```typescript
 * import { SetCaptchaOptions } from './constants';
 * 
 * const defaultOptions: SetCaptchaOptions = { size: 40, color: 'blue' };
 * const userOptions: Partial<SetCaptchaOptions> = { size: 60 };
 * 
 * const result = merge(defaultOptions, userOptions) as SetCaptchaOptions;
 * ```
 * 
 * @internal
 */
export const merge = (oldObject: object, newObject: object): object => {
	for (const prop in newObject) {
		(oldObject as any)[prop] = (newObject as any)[prop];
	}
	return oldObject;
};