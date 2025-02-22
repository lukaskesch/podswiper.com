-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `channel` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`defaultThumbnailLink` varchar(1023),
	`mediumThumbnailLink` varchar(1023),
	`highThumbnailLink` varchar(1023),
	`uploadPlaylistId` varchar(255) NOT NULL,
	`videoCount` bigint unsigned NOT NULL,
	`viewCount` bigint unsigned,
	`subscriberCount` bigint unsigned,
	`publishedAt` datetime NOT NULL,
	`lastSync` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`last_video_sync` timestamp,
	CONSTRAINT `channel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `google_user` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255),
	`profile_picture_link` varchar(255),
	`access_token` varchar(2048),
	`access_token_expires_at` timestamp,
	`refresh_token` varchar(512),
	`authorized_scopes` varchar(4095),
	`must_watch_playlist_id` varchar(1023),
	`may_watch_playlist_id` varchar(1023),
	CONSTRAINT `google_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `email` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `google_user_subscription` (
	`id` varchar(255) NOT NULL,
	`google_user_id` varchar(255) NOT NULL,
	`channel_id` varchar(255) NOT NULL,
	`is_ignore` tinyint(1) DEFAULT 0,
	`last_sync` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `google_user_subscription_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `google_user_swipe` (
	`id` varchar(255) NOT NULL,
	`google_user_id` varchar(255) NOT NULL,
	`video_id` varchar(255) NOT NULL,
	`reaction` enum('must','may','no') DEFAULT 'no',
	`created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `google_user_swipe_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `video` (
	`id` varchar(255) NOT NULL,
	`channelId` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`duration` time,
	`publishedAt` datetime,
	`viewCount` bigint unsigned,
	`likeCount` bigint unsigned,
	`hasCaption` tinyint(1),
	`defaultThumbnailLink` varchar(1023),
	`mediumThumbnailLink` varchar(1023),
	`highThumbnailLink` varchar(1023),
	`standardThumbnailLink` varchar(1023),
	`iFrameLink` varchar(1023),
	`lastSync` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `video_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `google_user_subscription` ADD CONSTRAINT `c_fk` FOREIGN KEY (`channel_id`) REFERENCES `channel`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `google_user_subscription` ADD CONSTRAINT `gu_fk` FOREIGN KEY (`google_user_id`) REFERENCES `google_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `google_user_swipe` ADD CONSTRAINT `gu_swipe_fk` FOREIGN KEY (`google_user_id`) REFERENCES `google_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `google_user_swipe` ADD CONSTRAINT `v_fk` FOREIGN KEY (`video_id`) REFERENCES `video`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `video` ADD CONSTRAINT `channelForeignKey` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `index_name` ON `video` (`publishedAt`);
*/