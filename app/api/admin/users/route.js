import { NextResponse } from 'next/server';

import { getUsers } from 'lib/http/usersDAO';

/**
 * Method to retrieve a list of all users in the system
 *
 * @param request
 * @param payload
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
	const params = request.nextUrl.searchParams;

	try {
		const notes = await getUsers(params.role, params.permission);
		return NextResponse.json(notes, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Server issue' }, { status: 500 });
	}
}