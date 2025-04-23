import { sequence } from '@sveltejs/kit/hooks';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';
import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken
} from '$lib/server/auth/session';
import type { User } from '$lib/types/schema';

const dbHandle: Handle = async ({ event, resolve }) => {
	event.locals.db = drizzle(event.platform?.env.DB as D1Database);

	return await resolve(event);
};

const sessionHandle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');
	if (token === undefined) {
		// If trying to access protected resources,
		// redirect to /
		if (event.route?.id?.startsWith('/(protected)/')) {
			throw redirect(302, '/');
		}

		return await resolve(event);
	}

	const { user, session } = await validateSessionToken(token, event.locals.db);

	if (session === null) {
		deleteSessionTokenCookie(event);
		return await resolve(event);
	} else {
		setSessionTokenCookie(event, token, session.expiresAt);
	}

	event.locals.user = user;
	event.locals.session = session;

	// Protected admin routes require admin access
	if (event.route?.id?.startsWith('/(protected)/admin/')) {
		if (!user?.isAdmin) {
			throw redirect(302, '/');
		}
	}

	return await resolve(event);
};

export const handle = sequence(dbHandle, sessionHandle);
