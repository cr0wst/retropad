import { authSessionTable, authUserTable } from '$lib/server/db/schema';
import { type Session, type User } from '$lib/types/schema';
import { padsTable, notesTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { db } = locals;

	const statistics: Statistics = {
		totalUsers: 0,
		totalSessions: 0,
		totalAdmins: 0,
		totalPads: 0,
		totalNotes: 0
	};

	// Query for statistics
	const users: User[] = await db.select().from(authUserTable);
	const sessions: Session[] = await db.select().from(authSessionTable);
	const pads = await db.select().from(padsTable);
	const notes = await db.select().from(notesTable);

	statistics.totalUsers = users.length;
	statistics.totalAdmins = users.filter((user) => user.isAdmin).length;
	statistics.totalSessions = sessions.length;
	statistics.totalPads = pads.length;
	statistics.totalNotes = notes.length;

	return {
		statistics
	};
};

type Statistics = {
	totalUsers: number;
	totalSessions: number;
	totalAdmins: number;
	totalPads: number;
	totalNotes: number;
};
