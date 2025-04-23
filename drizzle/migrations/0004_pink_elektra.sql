CREATE TABLE `bookmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`note_id` text NOT NULL,
	`line` integer NOT NULL,
	`label` text NOT NULL,
	`color` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`pad_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`tags` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`pad_id`) REFERENCES `pads`(`id`) ON UPDATE no action ON DELETE no action
);
