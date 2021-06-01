module.exports = {
	/**
     * Merge two objects
     * @param {object} oldObject
     * @param {object} newObject
     */
	merge: function(oldObject, newObject) {
		for (const prop in newObject) {
			oldObject[prop] = newObject[prop];
		}
		return oldObject;
	},
};