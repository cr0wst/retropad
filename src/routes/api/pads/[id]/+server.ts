import { json } from '@sveltejs/kit';
import { padsTable, notesTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function DELETE({ params, locals }) {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const { id } = params;

	// Verify pad ownership
	const [pad] = await locals.db.select().from(padsTable).where(eq(padsTable.id, id)).limit(1);

	if (!pad) {
		throw error(404, 'Pad not found');
	}

	if (pad.ownerId !== locals.user.id) {
		throw error(403, 'Not authorized to delete this pad');
	}

	// Delete all notes associated with this pad first
	await locals.db.delete(notesTable).where(eq(notesTable.padId, id));

	// Then delete the pad
	await locals.db.delete(padsTable).where(eq(padsTable.id, id));

	return new Response(null, { status: 204 });
}
