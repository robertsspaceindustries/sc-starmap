/**
 * @param {Object} object
 * @param {Array.<String>} keys
 */
export default function filter(object, keys) {
	for (const key of Object.keys(object)) {
		if (!keys.includes(key)) {
			delete object[key];
		}
	}

	return object;
}
