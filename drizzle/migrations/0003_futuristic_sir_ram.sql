PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_pads` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_pads`("id", "owner_id", "name", "description", "created_at", "updated_at") SELECT "id", "owner_id", "name", "description", "created_at", "updated_at" FROM `pads`;--> statement-breakpoint
DROP TABLE `pads`;--> statement-breakpoint
ALTER TABLE `__new_pads` RENAME TO `pads`;--> statement-breakpoint
PRAGMA foreign_keys=ON;