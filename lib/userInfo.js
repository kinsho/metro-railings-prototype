'use client'

import dayjs from "dayjs";

import { USER_API } from 'lib/http/apiEndpoints';
import { httpRequest } from 'lib/http/clientHttpRequester';

// Class to manage a copy of the user profile in local memory so that we can reference the permissions outlined for
// that user on the client side

/**
 * Clear out the user session from local storage
 *
 * @author kinsho
 */
export function clearUserSession() {
	window.localStorage.removeItem('mr-user');
}

/**
 * Store a new user session into local storage
 *
 * @param Object - the user profile to store
 *
 * @author kinsho
 */
export function storeUserSession(session) {
	const now = dayjs();
	session.expiration = now.add(1, 'month');

	window.localStorage.setItem('mr-user', JSON.stringify(session));
}

/**
 * Retrieves a user session from local storage
 *
 * @author kinsho
 */
export function getUserSession() {
	const now = dayjs();
	const session = JSON.parse(window.localStorage.getItem('mr-user'));

	// Ensure that a viable session is there and that it hasn't expired as of yet
	if (session?.expiration && now.isBefore(session.expiration)) {
		return session;
	} else {
		return null;
	}
}

/**
 * Constructs an object mapping usernames to legal names
 *
 * @author kinsho
 */
export async function buildUserMap() {
	// Fetch all the users from the back-end first
	const users = await httpRequest(USER_API.USERS, 'GET', {});

	// Construct the map
	let userMap = {};
	users.forEach((user) => {
		userMap[user.username] = user.fullName || user.lastName;
	});

	return userMap;
}