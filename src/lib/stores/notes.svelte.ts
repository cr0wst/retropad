// Types
export interface NoteOptions {
	wordWrap: boolean;
	// We can easily add more options here in the future
}

export interface Bookmark {
	id: string;
	noteId: string;
	line: number;
	label: string;
	color: string;
	createdAt: Date;
}

// Base note type from database
interface BaseNote {
	id: string;
	padId: string;
	title: string;
	content: string;
	tags?: string | null;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
	options: NoteOptions | null;
	bookmarks?: Bookmark[];
}

// Note type with parsed options for use in the app
export interface Note extends Omit<BaseNote, 'options'> {
	options: NoteOptions;
	tags?: string | null;
	bookmarks?: Bookmark[];
}

// Type for note updates sent to API
interface NoteApiUpdate {
	title?: string;
	content?: string;
	tags?: string | undefined;
	options?: string;
}

// Type for note updates in local state
interface NoteUpdate {
	title?: string;
	content?: string;
	tags?: string | undefined;
	options?: Partial<NoteOptions>;
	bookmarks?: Bookmark[];
}

// Type for API response
interface NoteResponse {
	id: string;
	title: string;
	content: string;
	tags: string | null;
	options: string | null;
	updatedAt: string;
}

// Save status type
type SaveStatus = 'saved' | 'saving' | 'error';

// Types for API requests
interface CreateNoteRequest {
	padId: string;
	title: string;
	content: string;
	tags?: string;
	options: string; // JSON string
}

// State
let notes = $state<Note[]>([]);
let activeNoteId = $state<string | null>(null);
let untitledCount = $state(0);
let lastSaveTime = $state(Date.now());
let saveStatus = $state<SaveStatus>('saved');
let saveTimeout: ReturnType<typeof setTimeout>;

// Derived values
const activeNoteValue = $derived(notes.find((note) => note.id === activeNoteId));

// State getters
export function getActiveNote() {
	return activeNoteValue;
}

export function getNotes() {
	return notes;
}

export function getActiveNoteId() {
	return activeNoteId;
}

export function getUntitledCount() {
	return untitledCount;
}

export function getLastSaveTime() {
	return lastSaveTime;
}

export function getSaveStatus() {
	return saveStatus;
}

// Actions
export function initNotes(initialNotes: BaseNote[]) {
	const defaultOptions: NoteOptions = { wordWrap: true };

	// Convert notes to the app format
	const notesWithOptions: Note[] = initialNotes.map((note) => ({
		...note,
		options: note.options || defaultOptions
	}));

	notes = notesWithOptions;
	activeNoteId = notesWithOptions[0]?.id || null;
}

export async function createNote(padId: string) {
	untitledCount++;
	const title = untitledCount === 1 ? 'Untitled Note' : `Untitled Note ${untitledCount}`;

	const defaultOptions: NoteOptions = { wordWrap: true };

	try {
		// Create note in database first
		const request: CreateNoteRequest = {
			padId,
			title,
			content: '',
			tags: '',
			options: JSON.stringify(defaultOptions)
		};

		const response = await fetch(`/api/notes`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		});

		if (!response.ok) {
			throw new Error('Failed to create note');
		}

		const newNote = (await response.json()) as BaseNote;

		// Parse options from JSON string
		const noteWithParsedOptions: Note = {
			...newNote,
			options: newNote.options || defaultOptions
		};

		// Update local state with the note from the server
		notes = [noteWithParsedOptions, ...notes];
		activeNoteId = noteWithParsedOptions.id;
	} catch (error) {
		console.error('Error creating note:', error);
		// TODO: Show error toast or notification
	}
}

export function updateNote(id: string, updates: NoteUpdate) {
	// Find the current note
	const currentNote = notes.find((note) => note.id === id);
	if (!currentNote) return;

	// If updating options, merge with existing options
	const updatedOptions = updates.options
		? { ...currentNote.options, ...updates.options }
		: currentNote.options;

	// Update local state immediately for responsiveness
	notes = notes.map((note) =>
		note.id === id
			? {
					...note,
					...updates,
					options: updatedOptions,
					// Preserve bookmarks when updating other fields
					bookmarks: updates.bookmarks || note.bookmarks
				}
			: note
	);

	// Schedule auto-save
	if (saveTimeout) clearTimeout(saveTimeout);
	saveStatus = 'saving';
	saveTimeout = setTimeout(async () => {
		try {
			// Get the current state of the note after local update
			const noteToUpdate = notes.find((note) => note.id === id);
			if (!noteToUpdate) throw new Error('Note not found');

			// Prepare API update with stringified options
			const apiUpdate: NoteApiUpdate = {
				title: noteToUpdate.title,
				content: noteToUpdate.content,
				tags: noteToUpdate.tags || undefined,
				options: JSON.stringify(noteToUpdate.options)
			};

			// Send the complete note data
			const response = await fetch(`/api/notes/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(apiUpdate)
			});

			if (!response.ok) {
				throw new Error('Failed to save note');
			}

			const savedNote = (await response.json()) as NoteResponse;
			lastSaveTime = Date.now();
			saveStatus = 'saved';

			// Update the note with all server data to ensure consistency
			notes = notes.map((note) =>
				note.id === id
					? {
							...note,
							title: savedNote.title,
							content: savedNote.content,
							tags: savedNote.tags,
							updatedAt: savedNote.updatedAt,
							options: savedNote.options ? JSON.parse(savedNote.options) : note.options,
							// Preserve bookmarks when updating from server
							bookmarks: note.bookmarks
						}
					: note
			);
		} catch (error) {
			console.error('Error saving note:', error);
			saveStatus = 'error';
		}
	}, 2000);
}

export function setActiveNote(id: string) {
	activeNoteId = id;
}

// Delete a note
export async function deleteNote(id: string) {
	try {
		const response = await fetch(`/api/notes/${id}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			throw new Error('Failed to delete note');
		}

		// Remove the note from local state
		notes = notes.filter((note) => note.id !== id);

		// If we deleted the active note, set active note to the first remaining note or null
		if (id === activeNoteId) {
			activeNoteId = notes[0]?.id || null;
		}
	} catch (error) {
		console.error('Error deleting note:', error);
		// TODO: Show error toast or notification
	}
}
