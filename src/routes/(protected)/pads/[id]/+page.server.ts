import { padsTable, notesTable, bookmarksTable, generateId } from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit';
import { eq, sql, desc, asc, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms/server';

// Type definitions for bookmarks
type Bookmark = {
	id: string;
	line: number;
	label: string;
	color: string;
};

const noteSchema = z.object({
	title: z
		.string()
		.min(1, { message: 'Please enter a title for your note' })
		.max(100, { message: 'Title must be 100 characters or less' })
		.trim(),
	content: z
		.string()
		.min(1, { message: 'Please enter some content for your note' })
		.max(50000, { message: 'Content must be 50,000 characters or less' })
		.trim(),
	tags: z
		.string()
		.max(500, { message: 'Tags must be 500 characters or less' })
		.optional()
		.transform((val) => (val === '' ? undefined : val))
});

// Generate mock notes for a pad
function generateMockNotes(padId: string, padName: string) {
	// Create GameFAQs style FAQs content
	return [
		{
			id: `note1_${padId}`,
			title: 'Golden Sun FAQ/Walkthrough',
			content: `*******************************************************************************
*                                                                             *
*                          GOLDEN SUN (Game Boy Advance)                      *
*                                                                             *
*                           Complete FAQ/Walkthrough                          *
*                                Version 3.0                                  *
*                                                                             *
*                               By KeyBlade999                                *
*                                                                             *
*******************************************************************************

TABLE OF CONTENTS
================================================================================

1. Updates and Author's Notes
2. Game Basics
   2.1 Controls
   2.2 Game Mechanics
   2.3 Djinn System
   2.4 Combat Basics
3. Walkthrough - Vale and Sol Sanctum
   3.1 Vale Village
   3.2 Mt. Aleph
   3.3 Sol Sanctum
4. Walkthrough - Vault to Imil
   4.1 Goma Range
   4.2 Vault
   4.3 Lunpa
   4.4 Bilibin
   4.5 Imil
5. Walkthrough - Mercury Lighthouse
   5.1 Mercury Lighthouse First Visit
   5.2 Mercury Lighthouse After Getting Frost
   5.3 Boss: Saturos
6. Walkthrough - Kolima to Fuchin Temple
   6.1 Kolima Forest
   6.2 Tret Tree
   6.3 Kolima Village
   6.4 Fuchin Temple
7. Djinn Locations
   7.1 Mercury Djinn
   7.2 Venus Djinn
   7.3 Mars Djinn
   7.4 Jupiter Djinn
8. Psynergy Stones and Summons
9. Equipment List
10. Boss Guide
11. Secrets and Side Quests
12. Frequently Asked Questions
13. Legal Information

================================================================================
1. UPDATES AND AUTHOR'S NOTES
================================================================================

Version 3.0 - January 15, 2022
- Complete walkthrough added
- All Djinn locations added
- Full equipment list
- Comprehensive boss strategies

This FAQ/Walkthrough is designed to help you through the amazing world of Golden 
Sun for the Game Boy Advance. This is an incredible RPG that features puzzle-
solving, exploration, and a unique magic/summon system called Djinn.

If you have any questions, corrections, or additional information, please 
contact me at KeyBlade999@example.com. I try to respond to all emails within 
48 hours.

================================================================================
2. GAME BASICS
================================================================================

2.1 CONTROLS
------------

D-Pad          - Move character, navigate menus
A Button       - Confirm selection, talk, examine
B Button       - Cancel, close menu
L Button       - Use Psynergy without entering menu (when mapped)
R Button       - Use item without entering menu (when mapped)
Start          - Open main menu
Select         - Rotate between party members (in field)

2.2 GAME MECHANICS
-----------------

Psynergy is the magic system in Golden Sun. There are four elemental types:
- Venus (Earth)
- Mars (Fire)
- Jupiter (Wind)
- Mercury (Water)

Each character has a natural affinity for one element, but can use others 
through the Djinn system.

2.3 DJINN SYSTEM
---------------

Djinn are elemental creatures that can be found throughout the world. When 
attached to a character, they enhance stats and allow for elemental Psynergy.

Djinn have three states:
- Set: Provides stat boosts and determines class
- Standby: Ready to be used for summons
- Recovery: After being used for summons, enters recovery state

2.4 COMBAT BASICS
----------------

Combat is turn-based. At the beginning of battle, you select actions for all 
your characters, then combat proceeds based on agility stats.

Actions include:
- Attack: Basic physical attack
- Psynergy: Cast spells (uses PP)
- Djinn: Use Djinn abilities (places them in Standby)
- Summon: Use Standby Djinn to summon powerful entities
- Item: Use items from inventory
- Defend: Reduce damage taken that turn

================================================================================
3. WALKTHROUGH - VALE AND SOL SANCTUM
================================================================================

3.1 VALE VILLAGE
--------------

The game begins with a storm threatening the village of Vale. After the 
introductory scene, you'll gain control of Isaac in his house.`,
			tags: ['walkthrough', 'basics'],
			createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
			updatedAt: new Date().toISOString()
		},
		{
			id: `note2_${padId}`,
			title: 'Golden Sun Djinn Guide',
			content: `=======================================================================
                      GOLDEN SUN - DJINN GUIDE
                       By: DjinnMaster 
                         Version 2.1
=======================================================================

TABLE OF CONTENTS
===============================

I.    Introduction
II.   What Are Djinn?
III.  Djinn Effects on Characters
IV.   All Djinn Locations
V.    Djinn Abilities
VI.   Recommended Djinn Setups
VII.  Summons
VIII. FAQ
IX.   Contact Info
X.    Credits

=======================================================================
I. INTRODUCTION
=======================================================================

Welcome to my comprehensive guide to the Djinn system in Golden Sun for
Game Boy Advance. This guide will cover everything you need to know
about finding, using, and mastering the Djinn system, which is the
core mechanic that makes Golden Sun's battle system so unique and
strategic.

If you're new to Golden Sun, Djinn are elemental creatures that you'll
collect throughout your adventure. They grant special abilities, change
your character classes, and allow you to perform powerful summons.
Mastering the Djinn system is essential to conquering the game's
toughest challenges.

=======================================================================
II. WHAT ARE DJINN?
=======================================================================

Djinn are magical elemental creatures tied to the four elements of 
Weyard (the world of Golden Sun):

- Venus (Earth) - Yellow
- Mars (Fire) - Red
- Jupiter (Wind) - Purple
- Mercury (Water) - Blue

There are 28 Djinn in the original Golden Sun (7 of each element).
Each character has a natural elemental affinity:

- Isaac: Venus (Earth)
- Garet: Mars (Fire)
- Ivan: Jupiter (Wind)
- Mia: Mercury (Water)

However, you can assign any Djinn to any character, which will change
their class and available Psynergy (magic).

Djinn have three states:
1. SET - Attached to a character, providing stat boosts and determining
   their class
2. STANDBY - Ready to be used for a summon
3. RECOVERY - After being used for a summon, enters recovery for a few
   turns before becoming available to set again

=======================================================================
III. DJINN EFFECTS ON CHARACTERS
=======================================================================

Each Djinn, when set to a character, will boost their stats based on
the element. Generally speaking:

Venus Djinn: Boost HP and Attack
Mars Djinn: Boost Attack and Defense
Jupiter Djinn: Boost PP, Agility, and Luck
Mercury Djinn: Boost HP, PP, and Defense

However, the most important effect of setting Djinn is changing a
character's class. While each character has a base class aligned with
their natural element, setting different elemental Djinn will change
them to different classes with different Psynergy abilities.

Example class changes for Isaac (base class: Squire - Venus):
- Setting Mars Djinn -> Brute classes
- Setting Jupiter Djinn -> Wind Seer classes
- Setting Mercury Djinn -> Hermit classes
- Mixed elements -> Various hybrid classes

The more Djinn of a non-native element you set, the more drastically
the class will change.

=======================================================================
IV. ALL DJINN LOCATIONS
=======================================================================

VENUS DJINN (7 total)
---------------------
1. Flint - Automatically obtained in the prologue
2. Granite - In Vale, near the river
3. Quartz - In Vault, inside the Inn
4. Vine - In Lunpa, hidden in a tree
5. Sap - In Kolima Forest, need Frost to access
6. Ground - Fuchin Temple basement
7. Bane - In Altmiller Cave

MARS DJINN (7 total)
--------------------
1. Forge - Vale Cave
2. Fever - In the forest north of Bilibin
3. Corona - In Kolima Forest 
4. Scorch - In the Mogall Forest
5. Ember - In Fuchin Temple
6. Flash - In Altin Peak Mines
7. Torch - Gondowan Cave

JUPITER DJINN (7 total)
-----------------------
1. Gust - In Vault, on the Mayor's roof
2. Breeze - In Goma Cave
3. Zephyr - Bilibin Cave
4. Kite - Mercury Lighthouse
5. Squall - In Fuchin Falls
6. Luff - In Altmiller Cave
7. Breath - In Lunpa Fortress

MERCURY DJINN (7 total)
-----------------------
1. Fizz - Imil, near the hot springs
2. Sleet - Mercury Lighthouse exterior
3. Mist - Mercury Lighthouse interior
4. Spritz - Kolima Village, in a tree
5. Hail - Bilibin, behind the palace
6. Tonic - Fuchin Temple, upper level
7. Dew - Altin Mines

=======================================================================
V. DJINN ABILITIES
=======================================================================

Each Djinn has a unique ability that can be used in battle. Using a
Djinn's ability changes it from Set to Standby, which means:
1. You temporarily lose the stat bonuses it provides
2. The character may change class mid-battle
3. The Djinn becomes available for summoning

Here are some of the most useful Djinn abilities:

VENUS DJINN
-----------
- Granite: Reduces damage to the party by 60% for one turn
- Sap: Restores HP equal to 60% of damage dealt
- Ground: May instantly down an enemy

MARS DJINN
----------
- Forge: Increases a character's Attack by 30%
- Flash: Increases a party member's Defense by 40%
- Corona: Deals Mars damage and may inflict Delusion

JUPITER DJINN
-------------
- Zephyr: Increases a party member's Agility by 60%
- Breeze: Cures all status ailments for the party
- Luff: May paralyze target

MERCURY DJINN
------------
- Mist: Revives a downed ally with 50% HP
- Fizz: Restores 70 HP to a single ally
- Tonic: Restores 150 HP to the party`,
			tags: ['djinn', 'guide'],
			createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
			updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
		}
	];
}

// Generate mock bookmarks for a note - specifically for GameFAQs style content
function generateMockBookmarks(noteId: string, noteContent: string): Bookmark[] {
	const lines = noteContent.split('\n');
	const bookmarks: Bookmark[] = [];

	if (noteId.includes('note1_')) {
		// Bookmarks for walkthrough
		bookmarks.push({
			id: `bm_${noteId}_1`,
			line: 15,
			label: 'Table of Contents',
			color: 'blue'
		});
		bookmarks.push({
			id: `bm_${noteId}_2`,
			line: 41,
			label: 'Updates and Notes',
			color: 'green'
		});
		bookmarks.push({
			id: `bm_${noteId}_3`,
			line: 61,
			label: 'Game Basics',
			color: 'purple'
		});
		bookmarks.push({
			id: `bm_${noteId}_4`,
			line: 112,
			label: 'Walkthrough - Vale',
			color: 'red'
		});
	} else if (noteId.includes('note2_')) {
		// Bookmarks for djinn guide
		bookmarks.push({
			id: `bm_${noteId}_1`,
			line: 8,
			label: 'Table of Contents',
			color: 'orange'
		});
		bookmarks.push({
			id: `bm_${noteId}_2`,
			line: 21,
			label: 'Introduction',
			color: 'teal'
		});
		bookmarks.push({
			id: `bm_${noteId}_3`,
			line: 36,
			label: 'What Are Djinn?',
			color: 'red'
		});
		bookmarks.push({
			id: `bm_${noteId}_4`,
			line: 65,
			label: 'Effects on Characters',
			color: 'blue'
		});
		bookmarks.push({
			id: `bm_${noteId}_5`,
			line: 87,
			label: 'Djinn Locations',
			color: 'green'
		});
		bookmarks.push({
			id: `bm_${noteId}_6`,
			line: 127,
			label: 'Djinn Abilities',
			color: 'purple'
		});
	}

	return bookmarks;
}

// Helper to get a random color
function getRandomColor() {
	const colors = ['red', 'blue', 'green', 'purple', 'orange', 'teal'];
	return colors[Math.floor(Math.random() * colors.length)];
}

export const load = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const { id } = params;

	// Fetch the pad
	const pads = await locals.db.select().from(padsTable).where(eq(padsTable.id, id)).limit(1);

	if (pads.length === 0) {
		throw error(404, 'Pad not found');
	}

	const pad = pads[0];

	// Check if user has access
	if (pad.ownerId !== locals.user.id) {
		throw error(403, 'Access denied');
	}

	// Fetch real notes for this pad with explicit date selection
	const notes = await locals.db
		.select({
			id: notesTable.id,
			padId: notesTable.padId,
			title: notesTable.title,
			content: notesTable.content,
			tags: notesTable.tags,
			options: notesTable.options,
			sortOrder: notesTable.sortOrder,
			createdAt: sql<string>`datetime(${notesTable.createdAt}, 'unixepoch')`,
			updatedAt: sql<string>`datetime(${notesTable.updatedAt}, 'unixepoch')`
		})
		.from(notesTable)
		.where(eq(notesTable.padId, id))
		.orderBy(asc(notesTable.id));

	// Fetch bookmarks for all notes
	const bookmarks = await locals.db
		.select()
		.from(bookmarksTable)
		.where(
			inArray(
				bookmarksTable.noteId,
				notes.map((note) => note.id)
			)
		);

	// Group bookmarks by note ID
	const bookmarksByNoteId = bookmarks.reduce(
		(acc, bookmark) => {
			if (!acc[bookmark.noteId]) {
				acc[bookmark.noteId] = [];
			}
			acc[bookmark.noteId].push(bookmark);
			return acc;
		},
		{} as Record<string, typeof bookmarks>
	);

	// Convert dates to ISO strings and ensure options are present
	const formattedNotes = notes.map((note) => ({
		...note,
		createdAt: new Date(note.createdAt).toISOString(),
		updatedAt: new Date(note.updatedAt).toISOString(),
		options: note.options ?? JSON.stringify({ wordWrap: true }),
		bookmarks: bookmarksByNoteId[note.id] || []
	}));

	return {
		pad,
		notes: formattedNotes
	};
};

export const actions = {
	createNote: async ({ request, params, locals }) => {
		if (!locals.user) {
			return fail(401, { form: null, error: 'Unauthorized' });
		}

		// Get the pad and verify ownership
		const pad = await locals.db.select().from(padsTable).where(eq(padsTable.id, params.id)).get();

		if (!pad) {
			return fail(404, { form: null, error: 'Pad not found' });
		}

		if (pad.ownerId !== locals.user.id) {
			return fail(403, { form: null, error: 'Not authorized to modify this pad' });
		}

		const form = await superValidate(request, zod(noteSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const [note] = await locals.db
			.insert(notesTable)
			.values({
				id: generateId(),
				padId: params.id,
				ownerId: locals.user.id,
				title: form.data.title,
				content: form.data.content,
				tags: form.data.tags,
				options: JSON.stringify({ wordWrap: true })
			})
			.returning();

		return { form };
	}
};
