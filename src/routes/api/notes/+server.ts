import { json } from '@sveltejs/kit';
import { notesTable, padsTable, generateId } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

interface CreateNoteRequest {
	padId: string;
	title: string;
	content: string;
	tags?: string;
	options?: string; // JSON string of options
}

export async function POST({ request, locals }) {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const data: CreateNoteRequest = await request.json();

	// Verify that the user owns the pad
	const [pad] = await locals.db
		.select()
		.from(padsTable)
		.where(eq(padsTable.id, data.padId))
		.limit(1);

	if (!pad) {
		throw error(404, 'Pad not found');
	}

	if (pad.ownerId !== locals.user.id) {
		throw error(403, 'Not authorized to modify this pad');
	}

	// Create the note
	const [note] = await locals.db
		.insert(notesTable)
		.values({
			id: generateId(),
			padId: data.padId,
			ownerId: locals.user.id,
			title: data.title,
			content: data.content,
			tags: data.tags,
			options: data.options,
			sortOrder: 0
		})
		.returning();

	return json(note);
}
