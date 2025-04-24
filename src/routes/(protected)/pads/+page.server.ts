import { padsTable } from '$lib/server/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	// If user is not logged in, don't fetch pads
	if (!locals.user) {
		return {
			pads: []
		};
	}

	// Get all pads for this user with explicit date selection
	const pads = await locals.db
		.select({
			id: padsTable.id,
			ownerId: padsTable.ownerId,
			name: padsTable.name,
			description: padsTable.description,
			createdAt: padsTable.createdAt,
			updatedAt: padsTable.updatedAt
		})
		.from(padsTable)
		.where(eq(padsTable.ownerId, locals.user.id))
		.orderBy(desc(padsTable.updatedAt));

	// Log raw data for debugging
	console.log('Raw pads from DB:', pads);

	// Convert timestamps to Date objects if they exist
	const processedPads = pads.map((pad) => ({
		...pad,
		createdAt: typeof pad.createdAt === 'number' ? new Date(pad.createdAt * 1000) : null,
		updatedAt: typeof pad.updatedAt === 'number' ? new Date(pad.updatedAt * 1000) : null
	}));

	// Log processed data for debugging
	console.log('Processed pads:', processedPads);

	return {
		pads: processedPads
	};
};
