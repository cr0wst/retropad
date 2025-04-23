import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { ulid } from 'ulid';

// Custom timestamp transformer
const timestampConfig = {
	mode: 'timestamp',
	transform: {
		from: (value: number) => new Date(value * 1000),
		to: (date: Date) => Math.floor(date.getTime() / 1000)
	}
} as const;

// Helper function to generate IDs
export const generateId = (prefix?: string) => {
	const id = ulid(); // Creates a ULID (26 characters, sortable, base32 encoding)
	return prefix ? `${prefix}_${id}` : id;
};

export const authUserTable = sqliteTable('auth_user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	providerId: text('provider_id').notNull().unique(),
	provider: text('provider').notNull(),
	avatarUrl: text('avatar_url').notNull(),
	isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', timestampConfig).notNull()
});

export const authSessionTable = sqliteTable('auth_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => authUserTable.id),
	expiresAt: integer('expires_at', timestampConfig).notNull()
});

export const padsTable = sqliteTable('pads', {
	id: text('id').primaryKey(),
	ownerId: text('owner_id')
		.notNull()
		.references(() => authUserTable.id),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: integer('created_at', timestampConfig)
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at', timestampConfig)
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Notes table for a pad
export const notesTable = sqliteTable('notes', {
	id: text('id').primaryKey(),
	padId: text('pad_id')
		.notNull()
		.references(() => padsTable.id, { onDelete: 'cascade' }),
	ownerId: text('owner_id')
		.notNull()
		.references(() => authUserTable.id),
	title: text('title').notNull(),
	content: text('content').notNull(),
	tags: text('tags'), // Store as JSON string for SQLite
	options: text('options'), // Store as JSON string for SQLite
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: integer('created_at', timestampConfig)
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at', timestampConfig)
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Bookmarks table for notes
export const bookmarksTable = sqliteTable('bookmarks', {
	id: text('id').primaryKey(),
	noteId: text('note_id')
		.notNull()
		.references(() => notesTable.id, { onDelete: 'cascade' }),
	label: text('label').notNull(),
	line: integer('line').notNull(),
	color: text('color').notNull().default('purple'),
	createdAt: integer('created_at', timestampConfig)
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});
