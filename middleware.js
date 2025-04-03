import { NextResponse } from 'next/server';

/**
 * The middleware function that NextJS will run on every single call made to the server. This will be chiefly used
 * for authenticating requests made to any administrative resource
 *
 * @param {NextRequest} request
 *
 * @author kinsho
 */
export function middleware(request) {
	console.log("Inside Middleware function...");
	// Only authenticate requests made to admin pages and admin API endpoints
	if (request.nextUrl.pathname.indexOf('/admin') >= 0) {
		try {
			if (JSON.parse(request.cookies.get('user').value).username) {
				return NextResponse.next();
			}
		}
		// If the cookie is not formatted properly or doesn't exist, redirect them straight to the log-in page
		catch (error) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}
}