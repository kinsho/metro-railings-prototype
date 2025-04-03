import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import dbConnect from "lib/database";
import { logRequest } from "lib/logger";

import User from "lib/models/user";

/**
 * Function to validate the credentials for a user trying to log in to the admin platform
 *
 * @param request
 */
export async function POST(request) {
	await dbConnect();
	const payloadData = await request.json();
	logRequest('api/user', 'POST', payloadData);

	const { username, password } = payloadData;

	try {
		const foundUser = await User.findOne({
			username : username
		}).select({
			_id: 0,
			id: 0,
			isActive: 0,
			firstName: 0,
			lastName: 0,
			fullname: 0
		}).exec();

		if (foundUser === null) {
			return NextResponse.json({ error: "No user found" }, { status: 404 });
		}
		// Check the password to validate it is correct
		if (foundUser.validatePassword(password)) {
			// Set up a cookie with the user's information and send that back to the user for future requests
			// Ensure the token expires every 30 days
			let expirationDate = new Date();
			expirationDate.setMonth(expirationDate.getMonth() + 1);
			cookies().set({
				name: 'user',
				value: JSON.stringify({ username: foundUser.username }),
				httpOnly: true,
				path: '/',
				expires: expirationDate,
				domain: process.env.DOMAIN,
				sameSite: 'strict'
			});
			return NextResponse.json(foundUser.toJSON(), { status: 200 });
		} else {
			return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
		}

	} catch (error) {
		console.error(error);
		return NextResponse.json( { error: 'Server issue' }, { status: 500 });
	}
}

/**
 * Function to log a user out from the system
 */
export function DELETE() {
	try {
		if (cookies().has('user')) {
			cookies().delete('user');
		}

		return NextResponse.json({}, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Server Issue' }, { status: 500 });
	}
}