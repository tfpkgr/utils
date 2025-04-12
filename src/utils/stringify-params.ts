/**
 * Allowed primitive types for query parameters.
 */
export type StringifyParamsTypes = string | number | boolean | null | undefined;

/**
 * Object shape for query parameters.
 * Values can be primitives, objects, or arrays of those.
 */
export type StringifyParams = Record<
	string,
	| StringifyParamsTypes
	| StringifyParamsTypes[]
	| Record<string, unknown>
	| Record<string, unknown>[]
>;

/**
 * Options for controlling how query parameters are stringified.
 */
export type StringifyParamsOptions = {
	/**
	 * The separator to use between key-value pairs when `returnType` is "string".
	 * Defaults to `&`.
	 */
	separator?: string;

	/**
	 * Specifies how arrays should be handled:
	 * - `'none'` (default): Each array element is added as a separate key-value pair.
	 * - `'comma'`: Array elements are joined with a comma and added as a single key-value pair.
	 * - `'bracket'`: Array elements are added as separate key-value pairs with `[]` appended to the key.
	 * - `'exclude'`: Arrays are excluded from the output.
	 */
	arrayType?: 'comma' | 'bracket' | 'none' | 'exclude';

	/**
	 * Whether to serialize objects into JSON strings. Defaults to `false`.
	 */
	serializeObjects?: boolean;

	/**
	 * Specifies the return type:
	 * - `'string'` (default): Returns a query string.
	 * - `'URLSearchParams'`: Returns a `URLSearchParams` object.
	 */
	returnType?: 'string' | 'URLSearchParams';
};

/**
 * Converts a value into a string suitable for a query string.
 *
 * @param value - The value to normalize.
 * @param allowObjects - Whether to allow objects to be serialized into JSON strings.
 * @returns The normalized string representation of the value.
 */
function normalizeValue(value: unknown, allowObjects: boolean): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'boolean') return value ? 'true' : 'false';
	if (typeof value === 'number' || typeof value === 'string')
		return String(value);

	if (allowObjects && typeof value === 'object') {
		try {
			return JSON.stringify(value);
		} catch {
			return '';
		}
	}

	return '';
}

/**
 * Validates the input parameters object.
 *
 * @param params - The parameters object to validate.
 * @throws Will throw an error if the input is not a non-null object or is an array.
 */
function validateParams(params: StringifyParams): void {
	if (
		typeof params !== 'object' ||
		params === null ||
		Array.isArray(params)
	) {
		throw new Error(
			'Parameters must be a non-null object and not an array.',
		);
	}
}

/**
 * Converts an object of parameters into a query string or `URLSearchParams` object.
 *
 * @param params - The parameters to be stringified. Each key-value pair represents a query parameter.
 * @param options - Optional configuration for how the parameters should be stringified.
 * @returns A query string if `returnType` is `'string'`, or a `URLSearchParams` object if `returnType` is `'URLSearchParams'`.
 * @throws Will throw an error if the `separator` is empty or contains `=` when `returnType` is "string".
 */
export function stringifyParams<T extends StringifyParamsOptions['returnType']>(
	params: StringifyParams,
	options: StringifyParamsOptions & {returnType: T},
): T extends 'string' ? string : URLSearchParams {
	validateParams(params);

	const {
		separator = '&',
		arrayType = 'none',
		serializeObjects = false,
		returnType,
	} = options;

	if (
		returnType === 'string' &&
		(separator.length === 0 || separator.includes('='))
	) {
		throw new Error('Invalid separator for string returnType.');
	}

	const keyValuePairs: [string, string][] = [];

	for (const [key, value] of Object.entries(params)) {
		const encodedKey = encodeURIComponent(key);

		if (Array.isArray(value)) {
			if (arrayType === 'exclude') continue;

			const encodedValues = value.map(val =>
				encodeURIComponent(normalizeValue(val, serializeObjects)),
			);

			if (arrayType === 'comma') {
				keyValuePairs.push([encodedKey, encodedValues.join(',')]);
			} else if (arrayType === 'bracket') {
				for (const val of encodedValues) {
					keyValuePairs.push([`${encodedKey}[]`, val]);
				}
			} else {
				for (const val of encodedValues) {
					keyValuePairs.push([encodedKey, val]);
				}
			}
		} else {
			const encodedValue = encodeURIComponent(
				normalizeValue(value, serializeObjects),
			);
			keyValuePairs.push([encodedKey, encodedValue]);
		}
	}

	if (returnType === 'URLSearchParams') {
		/**
		 * Converts the key-value pairs into a `URLSearchParams` object.
		 */
		const urlSearchParams = new URLSearchParams();
		for (const [k, v] of keyValuePairs) {
			urlSearchParams.append(k, v);
		}
		return urlSearchParams as T extends 'string' ? string : URLSearchParams;
	}

	/**
	 * Joins the key-value pairs into a query string using the specified separator.
	 */
	return keyValuePairs
		.map(([k, v]) => `${k}=${v}`)
		.join(separator) as T extends 'string' ? string : URLSearchParams;
}
