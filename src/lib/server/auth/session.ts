import { authUserTable, authSessionTable } from '$lib/server/db/schema';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import type { User, Session } from '$lib/types/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export function generateSessionToken(): string {
	return encodeBase32LowerCaseNoPadding(crypto.getRandomValues(new Uint8Array(20)));
}

export async function createSession(
	token: string,
	id: string,
	db: DrizzleD1Database
): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const session = {
		id: sessionId,
		userId: id,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};

	await db.insert(authSessionTable).values({
		id: session.id,
		userId: session.userId,
		expiresAt: session.expiresAt
	});

	return session;
}

export async function validateSessionToken(
	token: string,
	db: DrizzleD1Database
): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const [row] = await db
		.select()
		.from(authSessionTable)
		.where(eq(authSessionTable.id, sessionId))
		.innerJoin(authUserTable, eq(authUserTable.id, authSessionTable.userId));
	if (!row) {
		return { session: null, user: null };
	}

	const session = {
		id: row.auth_session.id,
		userId: row.auth_session.userId,
		expiresAt: row.auth_session.expiresAt
	};

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(authSessionTable).where(eq(authSessionTable.id, sessionId));
		return { session: null, user: null };
	}

	if (row.auth_user.isBanned) {
		if (row.auth_user.bannedUntil && Date.now() >= row.auth_user.bannedUntil.getTime()) {
			await db
				.update(authUserTable)
				.set({
					isBanned: false,
					bannedUntil: null,
					banReason: null,
					updatedAt: new Date()
				})
				.where(eq(authUserTable.id, row.auth_user.id));
		} else {
			await invalidateSession(sessionId, db);
			return { session: null, user: null };
		}
	}

	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

		await db
			.update(authSessionTable)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(authSessionTable.id, sessionId));
	}

	return { session, user: row.auth_user };
}

export async function invalidateSession(sessionId: string, db: DrizzleD1Database) {
	await db.delete(authSessionTable).where(eq(authSessionTable.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
