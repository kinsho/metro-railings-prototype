'use client'

import toast from 'react-hot-toast';

import { gatherQueryParams } from "lib/utils";
import { logResponse } from "lib/logger";

const timeoutMap = new Map();

/**
 * Wrapper for all calls to the Metro Railings API
 *
 * @param {string} url - url of the API endpoint
 * @param {string} httpMethod - the HTTP method denoting the nature of the request
 * @param {object} payload - the data to send over through the request body
 * @param {object} [toastMessages] - the messages to relay to the user via Toast
 * @param {number} [toastDelay] - an artificial delay should we want to delay notice
 *
 * @author kinsho
 */
export function httpRequest(url, httpMethod, payload = {}, toastMessages = {}, toastDelay = 0) {
	let fetchOptions = {};
	let queryString = '';
	const toastId = url + ' - ' + httpMethod;

	// For certain HTTP calls, parameters (if any) can only be passed through the URL inside the request
	if ((httpMethod === 'GET') || (httpMethod === 'DELETE')) {
		queryString = gatherQueryParams(payload);
	}

	// Build out the options that the fetch call will be using to construct the request
	// Ensure that a bearer token is attached should the authentication flag be set
	// Only accept JSON data back from the server
	fetchOptions.method = httpMethod;
	fetchOptions.headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
	};
	if ((httpMethod !== 'GET') && (httpMethod !== 'DELETE')) {
		fetchOptions.body = payload instanceof FormData ? payload : JSON.stringify(payload);
	}

	// Log the nature of this server call
	console.log("About to make a " + httpMethod + " call to " + url);
	console.log("--------- Payload ------------");
	console.log((httpMethod === 'GET' || httpMethod === 'DELETE') ? queryString : payload);

	// Start relaying toast messages if messages were passed in the first place
	// Also clear out any other incoming toast messages that may have been set in place by earlier calls to the exact
	// same URL
	if (timeoutMap.has(toastId)) {
		window.clearTimeout(timeoutMap.get(toastId));
		timeoutMap.delete(toastId);
	}

	if (toastMessages.loading) {
		toast.loading(toastMessages.loading, {
			id: toastId
		});
	}

	const returnPromise = new Promise((resolve, reject) => {
		try {
			fetch(url + queryString, fetchOptions)
				.then((res) => {
					if (res.status !== 200) {

						if (toastMessages.error) {
							timeoutMap.set(toastId, window.setTimeout(() => {
								toast.error(toastMessages.error, { id: toastId });
								timeoutMap.delete(toastId);
							}, toastDelay));
						} else {
							toast.dismiss(toastId);
						}

						console.log(res);
						reject(res);
					} else {
						if (toastMessages.success) {
							timeoutMap.set(toastId, window.setTimeout(() => {
								toast.success(toastMessages.success, { id: toastId });
								timeoutMap.delete(toastId);
							}, toastDelay));
						} else {
							toast.dismiss(toastId);
						}

						return res.json();
					}
				})
				.then((res) => {
					logResponse(url, httpMethod, res);
					resolve(res);
				})
				.catch((err) => {
					console.error("(Fetch) " + httpMethod + " error: ", err);
					reject(err);
				});
		} catch(err) {
			console.log("System error?");
			reject(err);
		}
	});

	return returnPromise;
}

/**
 * Wrapper for all server actions to the Metro Railings server
 *
 * @param {function} serverAction - actual server function to invoke
 * @param {object} data - the data to send over
 * @param {object} [toastMessages] - the messages to relay to the user via Toast
 * @param {Number} [toastDelay] - an artificial delay should we want to delay notice
 *
 * @author kinsho
 */
export async function serverActionCall(serverAction, params, toastMessages, toastDelay = 0) {
	let serverResponse = null;
	const toastId = serverAction.name;

	// Start relaying toast messages if messages were passed in the first place
	// Also clear out any other incoming toast messages that may have been set in place by earlier calls to the exact
	// same URL
	if (timeoutMap.has(toastId)) {
		window.clearTimeout(timeoutMap.get(toastId));
		timeoutMap.delete(toastId);
	}

	if (toastMessages?.loading) {
		toast.loading(toastMessages.loading, {
			id: toastId
		});
	}

	try {
		serverResponse = await serverAction(params);
	} catch(error) {
		console.error(error);

		if (toastMessages?.error) {
			timeoutMap.set(toastId, window.setTimeout(() => {
				toast.error(toastMessages.error, { id: toastId });
				timeoutMap.delete(toastId);
			}, toastDelay));
		} else {
			toast.dismiss(toastId);
		}
	}

	if (serverResponse?.success && toastMessages?.success) {
		timeoutMap.set(toastId, window.setTimeout(() => {
			toast.success(toastMessages.success, { id: toastId });
			timeoutMap.delete(toastId);
		}, toastDelay));
	} else if (serverResponse?.success === false && toastMessages?.error) {
		timeoutMap.set(toastId, window.setTimeout(() => {
			toast.error(toastMessages.error, { id: toastId });
			timeoutMap.delete(toastId);
		}, toastDelay));
	} else {
		toast.dismiss(toastId);
	}

	return serverResponse;
}