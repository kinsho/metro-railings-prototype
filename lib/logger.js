/**
 * Log the request sent from the client
 *
 * @param {string} url - url of the API endpoint
 * @param {string} httpMethod - the HTTP method denoting the nature of the request
 * @param {Object|FormData} requestData - the data fed over to the server as part of the request
 *
 * @author kinsho
 */
export function logRequest(url, httpMethod, requestData) {
	console.log("A " + httpMethod + " call has been made to " + url);
	if (requestData) {
		console.log("Payload");
		console.log(requestData);
	}
}

/**
 * Log the response sent back from the server
 *
 * @param {string} url - url of the API endpoint
 * @param {string} httpMethod - the HTTP method denoting the nature of the request
 * @param {HtmlResponse} response - the response directly from the server
 *
 * @author kinsho
 */
export function logResponse(url, httpMethod, response) {
	console.log("Response received after making a " + httpMethod + " call to " + url);
	if (response.error) {
		console.error("Error Message: " + response.error)
	} else {
		console.log("Return Value");
		console.log(response);
	}
}

/**
 * Log a direct server call
 *
 * @param {string} url - url of the API endpoint
 * @param params
 *
 * @author kinsho
 */
export function logServerDatabaseCall(url, ...params) {
	console.log("The server initiated a direct call to " + url);
	if (params) {
		console.log("Payload");
		console.log(params);
	}
}