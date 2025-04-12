import uuid from '@tfpkgr/uuid';

export type UUIDGeneratorOptions = {
	/**
	 * A prefix to prepend to the generated identifier.
	 */
	prefix?: string;

	/**
	 * A suffix to append to the generated identifier.
	 */
	suffix?: string;

	/**
	 * A separator to use between the prefix, hash, ID, and suffix.
	 * Defaults to an empty string if not provided.
	 */
	separator?: string;
};

/**
 * Generates a unique identifier string based on the provided prefix, name, and namespace.
 *
 * @param name - The name to be used for generating the hash.
 * @param namespace - The namespace to be used for generating the hash.
 * @param options - Optional configuration for the generator.
 * @param options.prefix - The prefix to prepend to the identifier.
 * @param options.suffix - The suffix to append to the identifier.
 * @param options.separator - The separator to use between components of the identifier.
 * @returns A unique identifier string.
 */
export function uuidGenerator(
	name: string,
	namespace: string,
	options: UUIDGeneratorOptions = {},
): string {
	// Generate a random UUID and a namespace-based hash.
	const id = uuid();
	const hash = uuid.v5(name, namespace);

	// Extract options or use defaults.
	const prefix = options.prefix || '';
	const suffix = options.suffix || '';
	const separator = options.separator || '';

	// Construct the result string by concatenating components with the separator.
	let result = '';

	// Add prefix if provided.
	if (prefix) {
		result += prefix + separator;
	}

	// Add hash if generated.
	if (hash) {
		result += hash + separator;
	}

	// Add random UUID if generated.
	if (id) {
		result += id + separator;
	}

	// Add suffix if provided.
	if (suffix) {
		result += suffix;
	}

	// Remove trailing separator if present.
	if (result.endsWith(separator)) {
		result = result.slice(0, -separator.length);
	}

	// Remove leading separator if present.
	if (result.startsWith(separator)) {
		result = result.slice(separator.length);
	}

	return result;
}
