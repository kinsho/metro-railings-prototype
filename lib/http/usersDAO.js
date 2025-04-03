import dbConnect from 'lib/database';
import { logServerDatabaseCall } from 'lib/logger';

import Users from 'lib/models/user';

/**
 * Function to retrieve a list of all users, filtered by roles and permissions
 *
 * @param [role] - a given role if we're only targeting users of a certain role
 * @param [permission] - a given permission if we're only targeting users with certain permissions
 */
export async function getUsers(role, permission) {
	await dbConnect();
	logServerDatabaseCall('lib/http/usersDAO/getUsers');

	let filters = {};
	if (role) {
		filters.role = role;
	}
	if (permission) {
		filters.permissions[permission] = true;
	}

	try {
		return await Users.find(filters).sort({ username: 1 }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to retrieve all user metadata for the passed usernames 
 *
 * @param usernames - a collection of usernames to search
 */
export async function getUsersByUsername(usernames) {
	await dbConnect();
	logServerDatabaseCall('lib/http/usersDAO/getUsersByUsername');

	try {
		return await Users.find({ username: { $in: usernames }}).select('-password -landingPage').exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to retrieve a list of all users records in our system, with all records pruned to include only basic information
 */
export async function getPrunedUserInformation() {
	await dbConnect();
	logServerDatabaseCall('lib/http/usersDAO/getPrunedUserInformation');

	try {
		return await Users.find().sort({ username: 1 }).select(['username', 'firstName', 'lastName']).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}