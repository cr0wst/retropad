import { json } from '@sveltejs/kit';
import { notesTable, padsTable } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

// Define allowed update fields
interface NoteUpdate {
	title?: string;
	content?: string;
	tags?: string;
	options?: string; // JSON string of options
}

export async function PATCH({ params, request, locals }) {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const { id } = params;
	const updates: NoteUpdate = await request.json();

	// Validate that the note exists and belongs to a pad owned by the user
	const [note] = await locals.db
		.select({
			padId: notesTable.padId,
			ownerId: padsTable.ownerId
		})
		.from(notesTable)
		.innerJoin(padsTable, eq(notesTable.padId, padsTable.id))
		.where(eq(notesTable.id, id))
		.limit(1);

	if (!note) {
		throw error(404, 'Note not found');
	}

	if (note.ownerId !== locals.user.id) {
		throw error(403, 'Not authorized to modify this note');
	}

	// Update the note with type-safe fields
	const [updatedNote] = await locals.db
		.update(notesTable)
		.set({
			...(updates.title !== undefined && { title: updates.title }),
			...(updates.content !== undefined && { content: updates.content }),
			...(updates.tags !== undefined && { tags: updates.tags }),
			...(updates.options !== undefined && { options: updates.options }),
			updatedAt: new Date() // Use a Date object which Drizzle will convert to the correct format
		})
		.where(eq(notesTable.id, id))
		.returning();

	return json(updatedNote);
}

export async function DELETE({ params, locals }) {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const { id } = params;

	// Validate that the note exists and belongs to a pad owned by the user
	const [note] = await locals.db
		.select({
			padId: notesTable.padId,
			ownerId: padsTable.ownerId
		})
		.from(notesTable)
		.innerJoin(padsTable, eq(notesTable.padId, padsTable.id))
		.where(eq(notesTable.id, id))
		.limit(1);

	if (!note) {
		throw error(404, 'Note not found');
	}

	if (note.ownerId !== locals.user.id) {
		throw error(403, 'Not authorized to delete this note');
	}

	// Delete the note
	await locals.db.delete(notesTable).where(eq(notesTable.id, id));

	return new Response(null, { status: 204 });
}
