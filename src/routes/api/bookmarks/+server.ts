import { json } from '@sveltejs/kit';
import { bookmarksTable, notesTable, padsTable, generateId } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

interface CreateBookmarkRequest {
	noteId: string;
	line: number;
	label: string;
	color?: string;
}

export async function POST({ request, locals }) {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const data: CreateBookmarkRequest = await request.json();

	// Verify that the user owns the note through the pad
	const [note] = await locals.db
		.select({
			padId: notesTable.padId,
			ownerId: padsTable.ownerId
		})
		.from(notesTable)
		.innerJoin(padsTable, eq(notesTable.padId, padsTable.id))
		.where(eq(notesTable.id, data.noteId))
		.limit(1);

	if (!note) {
		throw error(404, 'Note not found');
	}

	if (note.ownerId !== locals.user.id) {
		throw error(403, 'Not authorized to modify this note');
	}

	// Create the bookmark
	const [bookmark] = await locals.db
		.insert(bookmarksTable)
		.values({
			id: generateId(),
			noteId: data.noteId,
			line: data.line,
			label: data.label,
			color: data.color || 'purple'
		})
		.returning();

	return json(bookmark);
}
