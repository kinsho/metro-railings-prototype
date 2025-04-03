import { gatherQueryParams } from 'lib/utils';
import { logResponse } from 'lib/logger';

/**
 * Wrapper for all calls to the Metro Railings API
 *
 * @param {string} url - url of the API endpoint
 * @param {string} httpMethod - the HTTP method denoting the nature of the request
 * @param {object} payload - the data to send over through the request body
 * @param {string} [authorizationToken] - the authorization token to include in the request headers, if one is necessary
 *
 * @author kinsho
 */
export async function httpRequest(url, httpMethod, payload = {}, authorizationToken) {
	let fetchOptions = {};
	let queryString = '';

	// For certain HTTP calls, parameters (if any) can only be passed through the URL inside the request
	if ((httpMethod === 'GET') || (httpMethod === 'DELETE')) {
		queryString = gatherQueryParams(payload);
	}

	// Build out the options that the fetch call will be using to construct the request
	// Ensure that a bearer token is attached should the authentication flag be set
	// Only accept JSON data back from the server
	fetchOptions.method = httpMethod;
	fetchOptions.headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	if ((httpMethod !== 'GET') && (httpMethod !== 'DELETE')) {
		fetchOptions.body = JSON.stringify(payload);
	}
	if (authorizationToken) {
		fetchOptions.headers.Authorization = authorizationToken;
	}

	// Log the nature of this server call
	console.log("About to make a " + httpMethod + " call to " + url);
	console.log("--------- Payload ------------");
	console.log((httpMethod === 'GET' || httpMethod === 'DELETE') ? queryString : payload);

	const returnPromise = new Promise((resolve, reject) => {
		fetch(url + queryString, fetchOptions)
			.then((res) => res.json())
			.then((res) => {
				logResponse(url, httpMethod, res);
				resolve(res);
			})
			.catch((err) => {
				console.error("(Fetch) " + httpMethod + " error: ", err);
				reject(err);
			});
	});

	return await returnPromise;
}