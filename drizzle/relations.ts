import { relations } from "drizzle-orm/relations";
import { channel, googleUserSubscription, googleUser, googleUserSwipe, video } from "../src/db/schema";

export const googleUserSubscriptionRelations = relations(googleUserSubscription, ({one}) => ({
	channel: one(channel, {
		fields: [googleUserSubscription.channelId],
		references: [channel.id]
	}),
	googleUser: one(googleUser, {
		fields: [googleUserSubscription.googleUserId],
		references: [googleUser.id]
	}),
}));

export const channelRelations = relations(channel, ({many}) => ({
	googleUserSubscriptions: many(googleUserSubscription),
	videos: many(video),
}));

export const googleUserRelations = relations(googleUser, ({many}) => ({
	googleUserSubscriptions: many(googleUserSubscription),
	googleUserSwipes: many(googleUserSwipe),
}));

export const googleUserSwipeRelations = relations(googleUserSwipe, ({one}) => ({
	googleUser: one(googleUser, {
		fields: [googleUserSwipe.googleUserId],
		references: [googleUser.id]
	}),
	video: one(video, {
		fields: [googleUserSwipe.videoId],
		references: [video.id]
	}),
}));

export const videoRelations = relations(video, ({one, many}) => ({
	googleUserSwipes: many(googleUserSwipe),
	channel: one(channel, {
		fields: [video.channelId],
		references: [channel.id]
	}),
}));