import { json } from '@sveltejs/kit';
import { bookmarksTable, notesTable, padsTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

interface BookmarkUpdate {
	label?: string;
	color?: string;
}

export async function PATCH({ params, request, locals }) {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const { id } = params;
	const updates: BookmarkUpdate = await request.json();

	// Verify that the user owns the bookmark through the note and pad
	const [bookmark] = await locals.db
		.select({
			noteId: bookmarksTable.noteId,
			padId: notesTable.padId,
			ownerId: padsTable.ownerId
		})
		.from(bookmarksTable)
		.innerJoin(notesTable, eq(bookmarksTable.noteId, notesTable.id))
		.innerJoin(padsTable, eq(notesTable.padId, padsTable.id))
		.where(eq(bookmarksTable.id, id))
		.limit(1);

	if (!bookmark) {
		throw error(404, 'Bookmark not found');
	}

	if (bookmark.ownerId !== locals.user.id) {
		throw error(403, 'Not authorized to modify this bookmark');
	}

	// Update the bookmark
	const [updatedBookmark] = await locals.db
		.update(bookmarksTable)
		.set({
			...(updates.label !== undefined && { label: updates.label }),
			...(updates.color !== undefined && { color: updates.color })
		})
		.where(eq(bookmarksTable.id, id))
		.returning();

	return json(updatedBookmark);
}

export async function DELETE({ params, locals }) {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const { id } = params;

	// Verify that the user owns the bookmark through the note and pad
	const [bookmark] = await locals.db
		.select({
			noteId: bookmarksTable.noteId,
			padId: notesTable.padId,
			ownerId: padsTable.ownerId
		})
		.from(bookmarksTable)
		.innerJoin(notesTable, eq(bookmarksTable.noteId, notesTable.id))
		.innerJoin(padsTable, eq(notesTable.padId, padsTable.id))
		.where(eq(bookmarksTable.id, id))
		.limit(1);

	if (!bookmark) {
		throw error(404, 'Bookmark not found');
	}

	if (bookmark.ownerId !== locals.user.id) {
		throw error(403, 'Not authorized to delete this bookmark');
	}

	// Delete the bookmark
	await locals.db.delete(bookmarksTable).where(eq(bookmarksTable.id, id));

	return new Response(null, { status: 204 });
}
