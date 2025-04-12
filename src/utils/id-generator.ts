import crypto from 'node:crypto';

/**
 * Generates a unique identifier string with an optional prefix and suffix.
 *
 * The generated ID consists of a timestamp (in base-36) and a random component.
 * The total length of the ID (excluding the prefix and suffix) is determined by the `length` parameter.
 *
 * @param length - The total length of the generated ID (default is 16).
 *                 Must be greater than or equal to the length of the timestamp.
 * @param prefix - An optional string to prepend to the generated ID.
 * @param suffix - An optional string to append to the generated ID.
 * @returns A unique identifier string in the format: `[prefix_]timestamp+randomPart[_suffix]`.
 * @throws {Error} If the specified `length` is less than the length of the timestamp.
 */
export function generateUniqueId(
	length = 16,
	prefix?: string,
	suffix?: string,
): string {
	const timestamp = Date.now().toString(36);

	if (length < timestamp.length) {
		throw new Error(
			`Length must be greater than or equal to the length of the timestamp (${timestamp.length}).`,
		);
	}

	const randomBytes = crypto.getRandomValues(new Uint8Array(length));
	const randomPart = Array.from(randomBytes)
		.map(b => b.toString(36).padStart(2, '0'))
		.join('')
		.slice(0, length);

	const coreId = `${timestamp}${randomPart}`;

	const parts = [];
	if (prefix) parts.push(prefix);
	parts.push(coreId);
	if (suffix) parts.push(suffix);

	return parts.join('_');
}
