/**
 * A utility class for obscuring strings, such as emails and phone numbers.
 */
export class Obscure {
	private _string: string;
	private _start = 0;
	private _end = 0;
	private _mask = '*';

	/**
	 * Creates an instance of the Obscure class.
	 * @param string - The string to be obscured.
	 * @param start - The number of characters to keep visible at the start of the string.
	 * @param end - The number of characters to keep visible at the end of the string.
	 * @param mask - The character to use for masking the obscured portion of the string.
	 */
	constructor(
		string: string,
		start = this._start,
		end = this._end,
		mask = this._mask,
	) {
		this._string = string;
		this._start = start;
		this._end = end;
		this._mask = mask;
	}

	/**
	 * Obscures a string by masking characters between the start and end indices.
	 * @param str - The string to obscure.
	 * @param start - The number of characters to keep visible at the start.
	 * @param end - The number of characters to keep visible at the end.
	 * @param mask - The character to use for masking.
	 * @returns The obscured string.
	 * @throws Will throw an error if start or end values are negative.
	 */
	private obscure(
		str: string,
		start = this._start,
		end = this._end,
		mask = this._mask,
	): string {
		if (start < 0 || end < 0) {
			throw new Error('Start and end values must be non-negative.');
		}

		if (str.length <= start + end) {
			return str;
		}

		const maskedPart = mask.repeat(str.length - start - end);
		const visibleStart = str.slice(0, start);
		const visibleEnd = str.slice(-end);

		return `${visibleStart}${maskedPart}${visibleEnd}`;
	}

	/**
	 * Returns the obscured version of the string.
	 * @returns The obscured string.
	 */
	toString(): string {
		return this.obscure(this._string, this._start, this._end, this._mask);
	}

	/**
	 * Sets the mask character.
	 */
	set mask(mask: string) {
		this._mask = mask;
	}

	/**
	 * Gets the mask character.
	 */
	get mask(): string {
		return this._mask;
	}

	/**
	 * Sets the number of characters to keep visible at the start.
	 */
	set start(start: number) {
		this._start = start;
	}

	/**
	 * Gets the number of characters to keep visible at the start.
	 */
	get start(): number {
		return this._start;
	}

	/**
	 * Sets the number of characters to keep visible at the end.
	 */
	set end(end: number) {
		this._end = end;
	}

	/**
	 * Gets the number of characters to keep visible at the end.
	 */
	get end(): number {
		return this._end;
	}

	/**
	 * Sets the string to be obscured.
	 */
	set string(string: string) {
		this._string = string;
	}

	/**
	 * Gets the string to be obscured.
	 */
	get string(): string {
		return this._string;
	}

	/**
	 * Obscures an email address by masking the local part while keeping the domain visible.
	 * @returns The obscured email address.
	 */
	email(): string {
		if (!this._string.includes('@')) {
			return this.obscure(this._string, 2, 2);
		}

		const [localPart, domain] = this._string.split('@');
		const maskedLocalPart = this.obscure(localPart, 2, 2);
		return `${maskedLocalPart}@${domain}`;
	}

	/**
	 * Obscures a phone number by masking the middle digits while keeping the first
	 * and last two digits visible. Retains the original formatting.
	 * @returns The obscured phone number.
	 */
	phone(): string {
		// Normalize the phone number by removing non-digit characters
		const normalizedPhone = this._string.replace(/[^\d+]/g, '');

		// Validate the normalized phone number
		const phoneRegex = /^\+?[1-9]\d{1,14}$/;

		if (!phoneRegex.test(normalizedPhone)) {
			return this.obscure(this._string, 2, 2);
		}

		// Obscure the normalized phone number
		const obscuredPhone = this.obscure(normalizedPhone, 2, 2);

		// Reapply the original formatting to the obscured phone number
		let formattedPhone = '';
		let obscuredIndex = 0;

		for (const char of this._string) {
			if (/\d/.test(char) || char === '+') {
				formattedPhone += obscuredPhone[obscuredIndex++];
			} else {
				formattedPhone += char;
			}
		}

		return formattedPhone;
	}
}

/**
 * A utility function for obscuring strings, with additional methods for emails and phone numbers.
 */
export const obscure = Object.assign(
	/**
	 * Obscures a string by masking characters between the start and end indices.
	 * @param string - The string to obscure.
	 * @param start - The number of characters to keep visible at the start.
	 * @param end - The number of characters to keep visible at the end.
	 * @param mask - The character to use for masking.
	 * @returns The obscured string.
	 */
	(string: string, start?: number, end?: number, mask?: string): string => {
		const obscurer = new Obscure(string, start, end, mask);
		return obscurer.toString();
	},
	{
		/**
		 * Obscures an email address, keeping the first two and last two characters of the local part visible.
		 * @param string - The email address to obscure.
		 * @returns The obscured email address.
		 */
		email: (string: string): string => {
			const obscurer = new Obscure(string);
			return obscurer.email();
		},

		/**
		 * Obscures a phone number, keeping the first two and last two digits visible.
		 * @param string - The phone number to obscure.
		 * @returns The obscured phone number.
		 */
		phone: (string: string): string => {
			const obscurer = new Obscure(string);
			return obscurer.phone();
		},
	},
);
