import { authSessionTable, authUserTable } from '$lib/server/db/schema';
import { type Session, type User } from '$lib/types/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { db } = locals;

	const statistics: Statistics = {
		totalUsers: 0,
		totalSessions: 0,
		totalAdmins: 0
	};

	// Query for statistics
	const users: User[] = await db.select().from(authUserTable);

	statistics.totalUsers = users.length;
	statistics.totalAdmins = users.filter((user) => user.isAdmin).length;

	const sessions: Session[] = await db.select().from(authSessionTable);

	statistics.totalSessions = sessions.length;

	return {
		statistics
	};
};

type Statistics = {
	totalUsers: number;
	totalSessions: number;
	totalAdmins: number;
};
