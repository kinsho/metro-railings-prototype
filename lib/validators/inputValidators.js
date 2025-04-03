import validator from 'validator';

/**
 * Function to validate strings to ensure they meet a a certain length while only containing alphanumeric characters and
 * other special characters that have been specifically declared as allowed 
 *
 * @param text - the text to test
 * @param allowedChars - the special characters that are allowed to be included in any valid string
 * @param minLength - the minimum length of any valid string
 * @param maxLength - the maximum length of any valid string
 * @returns {boolean} asserting whether the text to test is valid
 *
 * @author kinsho
 */
export function validateCredentials(text, allowedChars = '', minLength = 0, maxLength = 1000) {
	if (text.length < minLength || text.length > maxLength) {
		return false;
	}

	return validator.isAlphanumeric(text, 'en-US', { ignore: allowedChars });
}

/**
 * Function to validate a passed string contains only numbers and absolutely nothing else
 *
 * @param text - the text to test
 * @returns {boolean} asserting whether the text to test is valid
 *
 * @author kinsho
 */
export function validateNumberOnly(text) {
	return validator.isNumeric(text || '', { no_symbols: true });
}

/**
 * Function to validate a passed string qualifies as a clean floating-point number
 *
 * @param text - the text to test
 * @returns {boolean} asserting whether the text to test is valid
 *
 * @author kinsho
 */
export function validateFloat(text) {
	text = (text || '') + '';
	const parts = text.split('.');

	if (parts.length > 2) { return false }

	for (let i = 0; i < parts.length; i += 1) {
		if (validator.isNumeric(parts[i]) === false ) {
			return false;
		}
	}

	return true;
}

/**
 * Function to validate a passed string is a properly formatted e-mail address
 *
 * @param text - the text to test
 * @returns {boolean} asserting whether the text to test is valid
 *
 * @author kinsho
 */
export function validateEmail(text) {
	return ((text === '') || (validator.isEmail(text)));
}

/**
 * Function to validate that a passed value or array is not "empty"
 *
 * @param value - the text to test
 * @returns {boolean} asserting whether the value to test is valid
 *
 * @author kinsho
 */
export function validateEmpty(value) {
	if (Array.isArray(value)) {
		return value.length > 0;
	} else {
		return ((value + '').trim() !== '');
	}
}

/**
 * Function to validate that a passed number is greater than zero
 *
 * @param num - the number to test
 * @returns {boolean} asserting whether the number to test is indeed positive
 *
 * @author kinsho
 */
export function validatePositive(num) {
	return ((num || 0) > 0);	
}

/**
 * Function to validate that a passed value is not null or undefined
 *
 * @param text - the value to test
 * @returns {boolean} asserting whether the text to test is valid
 *
 * @author kinsho
 */
export function validateDefined(value) {
	return !(value === null || value === undefined);
}

/**
 * Function to validate that the passed string represents a proper monetary amount
 *
 * @param num - the string to test
 * @returns {boolean} - asserting whether the text to test is valid
 *
 * @author kinsho
 */
export function validateCurrency(num) {
	const decimalPoints = num.split('.').length - 1;
	const sanitizedNumber = num.split('.').join('');
	const isChangeValid = !(num.split('.')[1]?.length > 2);

	return ((decimalPoints <= 1) && (validator.isNumeric(sanitizedNumber)) && isChangeValid);
}

/**
 * Function to validate a set of properties against preset validator functions
 *
 * @param test - a collection of tests to run through
 * @returns array<String> - a list of error messages to display should any of the tests fail
 *
 * @author kinsho
 */
export function runValidators(tests) {
	let errorMessages = [];

	for (let i = 0; i < tests.length; i += 1) {
		if (tests[i].validator(tests[i].prop) === false) {
			errorMessages.push(tests[i].errorMsg);
		}
	}

	return errorMessages;
}