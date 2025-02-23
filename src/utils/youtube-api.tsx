import { channel, googleUser } from "@/db/schema";
import { convertDateToMySqlDate } from "./date-time-converter";

export interface SubscriptionFetch {
  id: string;
  channel: typeof channel.$inferSelect;
}

export async function getAllSubscriptionsWithChannels(
  accessToken: string
): Promise<SubscriptionFetch[]> {
  const subscriptions = [];
  let pageToken = "";
  do {
    const response = await fetchSubscriptionPage(accessToken, pageToken);
    console.log(response);
    subscriptions.push(
      ...response.items.map((item: any) => ({
        id: item.id,
        channelId: item.snippet.resourceId.channelId,
        // channelId: item.snippet.channelId,
      }))
    );
    pageToken = response.nextPageToken;
  } while (pageToken);

  const subscriptionsWithChannel = await Promise.all(
    subscriptions.map(async (subscription) => {
      const channel = await getChannel(accessToken, subscription.channelId);
      const channelItem = channel.items[0];
      return {
        id: subscription.id,
        channel: {
          id: channelItem.id,
          name: channelItem.snippet.title,
          description: channelItem.snippet.description,
          defaultThumbnailLink: channelItem.snippet.thumbnails?.default.url,
          mediumThumbnailLink: channelItem.snippet.thumbnails?.medium.url,
          highThumbnailLink: channelItem.snippet.thumbnails?.high.url,
          uploadPlaylistId: channelItem.contentDetails.relatedPlaylists.uploads,
          videoCount: channelItem.statistics.videoCount,
          viewCount: channelItem.statistics.viewCount,
          subscriberCount: channelItem.statistics.subscriberCount,
          publishedAt: convertDateToMySqlDate(new Date(channelItem.snippet.publishedAt)),
          lastSync: new Date(),
        },
      };
    })
  );
  return subscriptionsWithChannel;
}

async function fetchSubscriptionPage(
  access_token: string,
  pageToken: string = ""
) {
  const queryParam = new URLSearchParams({
    part: "snippet,subscriberSnippet",
    mine: "true",
    maxResults: "50",
    pageToken: pageToken,
  });
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/subscriptions?${queryParam.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
      // next: {
      //   revalidate: 60 * 5,
      // },
    }
  );
  return response.json();
}

export async function getChannel(access_token: string, channelId: string) {
  const queryParam = new URLSearchParams({
    part: "snippet,statistics,contentDetails",
    id: channelId,
  });
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?${queryParam.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
      // next: {
      //   revalidate: 60 * 5,
      // },
    }
  );
  const json = await response.json();
  return json;
}
