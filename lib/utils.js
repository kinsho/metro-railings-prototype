// Utility file containing methods that can be leveraged across different server components
import crypto from "crypto";
import randomStr from 'randomstring';

/**
 * Function responsible for hashing a string using the SHA-256 algorithm and a secret key stored in our environment
 *
 * @TODO This way of cryptography is sadly deprecated in favor of window.crypto.subtle. So we need to follow suit, either with window.crypto.subtle or a library that takes advantage of the new crypto interface
 *
 * @param {String} text
 */
export function hashWithSecret(text) {
	return crypto.createHmac('sha256', process.env.SECRET).update(text).digest('hex');
}

/**
 * Function responsible for encrypting a string using the AES-192 algorithm and a secret key stored in our environment
 *
 * @TODO This way of cryptography is sadly deprecated in favor of window.crypto.subtle. So we need to follow suit, either with window.crypto.subtle or a library that takes advantage of the new crypto interface 
 *
 * @param {String} text
 */
export function encryptWithSecret(text) {
	const iv = Buffer.alloc(16, 0);
	const cipher = crypto.createCipheriv('aes-192-cbc', process.env.SECRET, iv);

	let cipherText = cipher.update(text, 'utf8','hex');
	return cipherText + cipher.final('hex');
}

/**
 * Function responsible for decrypting a AES-192 encoding that was encoded through our secret key at an earlier time
 *
 * @TODO This way of cryptography is sadly deprecated in favor of window.crypto.subtle. So we need to follow suit, either with window.crypto.subtle or a library that takes advantage of the new crypto interface
 *
 * @param {String} text
 */
export function decryptWithSecret(text) {
	const iv = Buffer.alloc(16, 0);
	const decipher = crypto.createDecipheriv('aes-192-cbc', process.env.SECRET, iv);

	let decipheredText = decipher.update(text, 'hex', 'utf8');
	return decipheredText + decipher.final('utf8');
}

/**
 * Given a URLSearchParams object, this function will return an object encapsulating all the key/value pairs stored
 * in the passed object. It gracefully handles array values as well
 */
export function parseQueryParams(urlObject) {
	let queryParams = {};

	urlObject.forEach((value, key) => {
		if (!queryParams[key]) {
			queryParams[key] = [];
		}
		queryParams[key].push(value);
	});

	// Flatten the object if it contains any arrays of a single length
	for (const key in queryParams) {
		if (queryParams[key].length === 1) {
			queryParams[key] = queryParams[key][0];
		}
	}

	return queryParams;
}

/**
 * Given an object of key-value pairs, construct a query string. This function gracefully handles array values as well
 */
export function gatherQueryParams(obj) {
	const keys = Object.keys(obj);
	let kvPairs = [];

	keys.forEach((key) => {
		if (Array.isArray(obj[key])) {
			for (let i = 0; i < obj[key].length; i += 1) {
				kvPairs.push(key + '=' + obj[key][i]);
			}
		} else {
			kvPairs.push(key + '=' + obj[key]);
		}
	});

	if (kvPairs.length) {
		return '?' + kvPairs.join('&');
	}

	return '';
}

/**
 * Function meant to hook a custom listener to the general document
 */
export function subscribe(eventName, listener, subscribeOnlyOnce) {
	console.log('EVENT SUBSCRIBED - ' + eventName);

	// In the event that this subscription can only be made once, ensure any past subscriptions are nullified
	if (subscribeOnlyOnce) {
		document.removeEventListener(eventName, listener);
	}
	document.addEventListener(eventName, listener);
}

/**
 * Function meant to unhook a custom listener from the general document
 */
export function unsubscribe(eventName, listener) {
	console.log('EVENT UNSUBSCRIBED - ' + eventName);

	document.removeEventListener(eventName, listener);
}

/**
 * Function designed to dispatch a custom event
 */
export function publish(eventName, data) {
	console.log('EVENT PUBLISHED - ' + eventName);

	const event = new CustomEvent(eventName, { detail: data });
	document.dispatchEvent(event);
}

/**
 * Function meant to parse system-read text into paragraphs
 * 
 * Paragraphs are defined as consecutive lines of text separated from other consecutive lines of text by an empty line
 */
export function textToParagraphs(str) {
	const lines = str.split('\n');
	let paragraphs = [];
	let beginLine = 0;

	for (let i = 0; i < lines.length; i += 1) {
		if (lines[i].length === 0) {
			paragraphs.push(lines.slice(beginLine, i).join(' '));
			beginLine = i + 1;
		}
	}

	paragraphs.push(lines.slice(beginLine, lines.length).join(' '));
	return paragraphs;
}

/**
 * Function meant to sort notes by category, status, and then date
 */
export function sortNotes(notes) {
	notes.sort((a, b) => {
		const aOpenTask = (a.type === 'task' && a.status === 'open');
		const bOpenTask = (b.type === 'task' && b.status === 'open');

		if (aOpenTask && !(bOpenTask)) {
			return -1;
		} else if (bOpenTask && !(aOpenTask)) {
			return 1;
		} else {
			return (new Date(a.dates.created) > new Date(b.dates.created) ? -1 : 1);
		}
	});
}

/**
 * Function meant to deliberately mask the order ID before presenting it in a publically-accessible URL
 */
export function obfuscateNumber(idNum) {
	idNum = idNum + '';
	let jumble = '';

	for (let i = 0; i < idNum.length; i += 1) {
		jumble += randomStr.generate({ length : (i % 2 ? 3 : 4), charset: 'alphabetic' }) + idNum[i];
	}

	return jumble;
}

/**
 * Function that decrypts the order ID from a jumbled string
 */
export function decryptNumber(jumble) {
	let idNum = '';

	for (let i = 0; i < jumble.length; i += 1) {
		if (Number.isNaN(parseInt(jumble[i], 10)) === false) {
			idNum += jumble[i];
		}
	}

	return (parseInt(idNum, 10) || 0);
}

/**
 * Function meant to calculate total price given a subtotal and flags indicating whether taxes and fees are to be applied
 */
export function calculateOrderTotal(subtotal, applyTax, applyFee, stateOfPurchase) {
	subtotal = parseFloat(subtotal) || 0;
	let taxes = 0;
	let fees = 0;

	// Check to make sure taxes are explicitly charged and eligible to be charged in the first place before calculating the tax liability
	if (stateOfPurchase === 'NJ' && applyTax) {
		taxes = Math.round(subtotal * 6.625) / 100;
	}
	// Check to make sure fees can be explicitly charged before calculating the credit card surcharge
	if (applyFee) {
		fees = Math.round(subtotal * 1.75) / 100;
	}

	return {
		tax: taxes,
		fee: fees,
		totalPrice: subtotal + taxes + fees
	};
}

/**
 * Function meant to format a dollar amount with commas wherever necessary
 */
export function formatUSDAmount(amount) {
	amount = (amount + '').split('.');
	const wholeAmount = amount[0];
	const decimalPortion = amount[1] || '00';
	let formattedAmount = '';

	let digitCount = 0;
	for (let i = wholeAmount.length - 1; i >= 0; i -= 1) {
		if (digitCount === 3) {
			formattedAmount = ',' + formattedAmount;
			digitCount = 0;
		}

		formattedAmount = wholeAmount[i] + formattedAmount;
		digitCount += 1;
	}

	return formattedAmount + '.' + (decimalPortion.length === 1 ? decimalPortion + '0' : decimalPortion.slice(0, 2));
}
