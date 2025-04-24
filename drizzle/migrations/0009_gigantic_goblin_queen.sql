ALTER TABLE `auth_user` ADD `is_banned` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `auth_user` ADD `banned_until` integer;--> statement-breakpoint
ALTER TABLE `auth_user` ADD `ban_reason` text;--> statement-breakpoint
ALTER TABLE `auth_user` ADD `updated_at` integer;