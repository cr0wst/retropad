import { error } from '@sveltejs/kit';
import { authUserTable } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { db, user } = locals;

	if (!user?.isAdmin) {
		throw error(403, 'Not authorized');
	}

	const users = await db.select().from(authUserTable);

	return {
		users
	};
};
