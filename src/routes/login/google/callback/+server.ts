import {
	generateSessionToken,
	createSession,
	setSessionTokenCookie
} from '$lib/server/auth/session';
import { google } from '$lib/server/auth/clients';
import { decodeIdToken } from 'arctic';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { eq, and } from 'drizzle-orm';
import { authUserTable } from '$lib/server/db/schema';

export async function GET(event: RequestEvent): Promise<Response> {
	const { db } = event.locals;

	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const claims: any = decodeIdToken(tokens.idToken());
	const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});

	const profile = await response.json<{
		sub: string;
		name: string;
		given_name: string;
		family_name: string;
		picture: string;
		email: string;
		email_verified: boolean;
	}>();

	const googleUserId: string = profile.sub;

	// Create or Update the user
	const [existingUser] = await db
		.select()
		.from(authUserTable)
		.where(and(eq(authUserTable.provider, 'google'), eq(authUserTable.providerId, googleUserId)));

	let userId: string;
	if (existingUser === undefined) {
		// Create new user
		userId = crypto.randomUUID();
		await db.insert(authUserTable).values({
			id: userId,
			providerId: googleUserId,
			provider: 'google',
			name: profile.name,
			email: profile.email,
			avatarUrl: profile.picture,
			createdAt: new Date()
		});
	} else {
		// Update existing user
		userId = existingUser.id;
		await db
			.update(authUserTable)
			.set({
				name: profile.name,
				email: profile.email,
				avatarUrl: profile.picture
			})
			.where(eq(authUserTable.id, userId));
	}

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, userId, db);

	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
