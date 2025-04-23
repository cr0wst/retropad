import type { Bookmark } from './notes.svelte';

// Type for bookmark updates
interface BookmarkUpdate {
	line: number;
	label?: string;
	color: string;
}

let bookmarks: Bookmark[] = [];

// Derived values
export function getBookmarks() {
	return bookmarks;
}

interface CreateBookmarkRequest {
	noteId: string;
	line: number;
	label: string;
	color: string;
}

interface BookmarkResponse {
	id: string;
	noteId: string;
	line: number;
	label: string;
	color: string;
	createdAt: string;
}

// Actions
export async function createBookmark(
	noteId: string,
	bookmark: Omit<CreateBookmarkRequest, 'noteId'>
): Promise<Bookmark | null> {
	try {
		const response = await fetch('/api/bookmarks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				noteId,
				...bookmark
			})
		});

		if (!response.ok) {
			throw new Error('Failed to create bookmark');
		}

		const data = (await response.json()) as BookmarkResponse;
		return {
			id: data.id,
			noteId: data.noteId,
			line: data.line,
			label: data.label,
			color: data.color,
			createdAt: new Date(data.createdAt)
		};
	} catch (error) {
		console.error('Error creating bookmark:', error);
		return null;
	}
}

export async function updateBookmark(id: string, update: BookmarkUpdate): Promise<Bookmark> {
	const response = await fetch(`/api/bookmarks/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(update)
	});

	const updatedBookmark = (await response.json()) as Bookmark;
	bookmarks = bookmarks.map((b) => (b.id === id ? updatedBookmark : b));
	return updatedBookmark;
}

export async function deleteBookmark(id: string): Promise<boolean> {
	try {
		const response = await fetch(`/api/bookmarks/${id}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			throw new Error('Failed to delete bookmark');
		}

		return true;
	} catch (error) {
		console.error('Error deleting bookmark:', error);
		return false;
	}
}

export async function loadBookmarks(noteId: string): Promise<void> {
	const response = await fetch(`/api/bookmarks?noteId=${noteId}`);
	const loadedBookmarks = (await response.json()) as Bookmark[];
	bookmarks = loadedBookmarks;
}

// Server sync functions
async function saveBookmark(bookmark: Bookmark) {
	try {
		const response = await fetch(`/api/bookmarks/${bookmark.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bookmark)
		});

		if (!response.ok) {
			throw new Error('Failed to save bookmark');
		}
	} catch (error) {
		console.error('Error saving bookmark:', error);
	}
}

async function deleteBookmarkFromServer(bookmarkId: string) {
	try {
		const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			throw new Error('Failed to delete bookmark');
		}
	} catch (error) {
		console.error('Error deleting bookmark:', error);
	}
}
