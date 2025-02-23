import {
  mysqlTable,
  primaryKey,
  varchar,
  text,
  bigint,
  datetime,
  timestamp,
  unique,
  mysqlEnum,
  index,
  time,
  tinyint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const channel = mysqlTable(
  "channel",
  {
    id: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    defaultThumbnailLink: varchar({ length: 1023 }),
    mediumThumbnailLink: varchar({ length: 1023 }),
    highThumbnailLink: varchar({ length: 1023 }),
    uploadPlaylistId: varchar({ length: 255 }).notNull(),
    videoCount: bigint({ mode: "number", unsigned: true }).notNull(),
    viewCount: bigint({ mode: "number", unsigned: true }),
    subscriberCount: bigint({ mode: "number", unsigned: true }),
    publishedAt: datetime({ mode: "string" }).notNull(),
    lastSync: timestamp({ mode: "string" }).defaultNow().notNull(),
    lastVideoSync: timestamp("last_video_sync", { mode: "string" }),
  },
  (table) => [primaryKey({ columns: [table.id], name: "channel_id" })]
);

export const googleUser = mysqlTable(
  "google_user",
  {
    id: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 255 }),
    profilePictureLink: varchar("profile_picture_link", { length: 255 }),
    accessToken: varchar("access_token", { length: 2048 }).notNull(),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      mode: "string",
    }).notNull(),
    refreshToken: varchar("refresh_token", { length: 512 }).notNull(),
    authorizedScopes: varchar("authorized_scopes", { length: 4095 }).notNull(),
    mustWatchPlaylistId: varchar("must_watch_playlist_id", { length: 1023 }),
    mayWatchPlaylistId: varchar("may_watch_playlist_id", { length: 1023 }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "google_user_id" }),
    unique("email").on(table.email),
  ]
);

export const googleUserSubscription = mysqlTable(
  "google_user_subscription",
  {
    id: varchar({ length: 255 }).notNull(),
    googleUserId: varchar("google_user_id", { length: 255 })
      .notNull()
      .references(() => googleUser.id),
    channelId: varchar("channel_id", { length: 255 })
      .notNull()
      .references(() => channel.id),
    isIgnore: tinyint("is_ignore").default(0),
    lastSync: timestamp("last_sync", { mode: "string" }).defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "google_user_subscription_id" }),
  ]
);

export const googleUserSwipe = mysqlTable(
  "google_user_swipe",
  {
    id: varchar({ length: 255 }).notNull(),
    googleUserId: varchar("google_user_id", { length: 255 })
      .notNull()
      .references(() => googleUser.id),
    videoId: varchar("video_id", { length: 255 })
      .notNull()
      .references(() => video.id),
    reaction: mysqlEnum(["must", "may", "no"]).default("no"),
    createdAt: datetime("created_at", { mode: "string" }).default(
      sql`(CURRENT_TIMESTAMP)`
    ),
  },
  (table) => [primaryKey({ columns: [table.id], name: "google_user_swipe_id" })]
);

export const video = mysqlTable(
  "video",
  {
    id: varchar({ length: 255 }).notNull(),
    channelId: varchar({ length: 255 })
      .notNull()
      .references(() => channel.id),
    title: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    duration: time(),
    publishedAt: datetime({ mode: "string" }),
    viewCount: bigint({ mode: "number", unsigned: true }),
    likeCount: bigint({ mode: "number", unsigned: true }),
    hasCaption: tinyint(),
    defaultThumbnailLink: varchar({ length: 1023 }),
    mediumThumbnailLink: varchar({ length: 1023 }),
    highThumbnailLink: varchar({ length: 1023 }),
    standardThumbnailLink: varchar({ length: 1023 }),
    iFrameLink: varchar({ length: 1023 }),
    lastSync: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    index("index_name").on(table.publishedAt),
    primaryKey({ columns: [table.id], name: "video_id" }),
  ]
);
