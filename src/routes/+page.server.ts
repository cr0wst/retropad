import { padsTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

// Helper to generate mock tags for pads
function generateMockTags(padName: string, padId: string): string[] {
	// Generate deterministic tags based on the pad name and ID
	const tags = [];

	// Add tags based on the first character of the name
	const firstChar = padName.charAt(0).toLowerCase();
	if ('abc'.includes(firstChar)) tags.push('personal');
	if ('def'.includes(firstChar)) tags.push('work');
	if ('ghij'.includes(firstChar)) tags.push('project');
	if ('klmn'.includes(firstChar)) tags.push('ideas');
	if ('opqr'.includes(firstChar)) tags.push('archive');
	if ('stuv'.includes(firstChar)) tags.push('reference');
	if ('wxyz'.includes(firstChar)) tags.push('notes');

	// Add a tag based on character length
	if (padName.length < 5) tags.push('quick');
	else if (padName.length < 10) tags.push('detail');
	else tags.push('documentation');

	// Ensure we have at least one tag
	if (tags.length === 0) tags.push('general');

	return tags;
}

export const load = async ({ locals }) => {
	// If user is not logged in, don't fetch pads
	if (!locals.user) {
		return {
			pads: []
		};
	}

	// Get all pads for this user
	const pads = await locals.db
		.select()
		.from(padsTable)
		.where(eq(padsTable.ownerId, locals.user.id))
		.orderBy(padsTable.updatedAt);

	// Add mock tags for demonstration (in a real app, these would come from the database)
	const padsWithTags = pads.map((pad) => ({
		...pad,
		tags: generateMockTags(pad.name, pad.id)
	}));

	return {
		pads: padsWithTags
	};
};
