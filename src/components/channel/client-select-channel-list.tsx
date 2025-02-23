"use client";

import { useState } from "react";
import Image from "next/image";
import { SubscriptionFetch } from "@/utils/youtube-api";
import { channel } from "@/db/schema";

export default function ClientChannels({
  subscriptions,
}: {
  subscriptions: SubscriptionFetch[];
}) {
  "use client";
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<
    string[]
  >([]);

  function getThumbnailLink(channelObject: typeof channel.$inferSelect) {
    // if (channel?.highThumbnailLink) {
    //   return channel.highThumbnailLink;
    // }
    if (channelObject?.mediumThumbnailLink) {
      return channelObject.mediumThumbnailLink;
    } else if (channelObject?.defaultThumbnailLink) {
      return channelObject.defaultThumbnailLink;
    } else {
      return "https://via.placeholder.com/150";
    }
  }

  function handleSubscriptionClick(subscription: SubscriptionFetch) {
    if (selectedSubscriptions.includes(subscription.id)) {
      setSelectedSubscriptions(
        selectedSubscriptions.filter((id) => id !== subscription.id)
      );
    } else {
      setSelectedSubscriptions([...selectedSubscriptions, subscription.id]);
    }
  }

  // console.log(selectedSubscriptions);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* <LogPropsToClient subscriptions={subscriptions} /> */}
      <h1 className="mt-5 text-2xl">Choose your channels to swipe</h1>
      <ul>
        {subscriptions.map((subscription, index) => (
          <li key={subscription.id} className="m-4">
            <div
              className="flex flex-row items-center gap-3 hover:cursor-pointer"
              onClick={() => handleSubscriptionClick(subscription)}>
              <div
                // className="rounded-full border-2 border-red-500 p-1"
                className={`rounded-full p-1 ${
                  selectedSubscriptions.includes(subscription.id)
                    ? "border-2 border-red-500 "
                    : "border-2 border-transparent"
                } transition-colors duration-150 `}>
                <Image
                  className="rounded-full"
                  src={getThumbnailLink(subscription.channel)}
                  alt={subscription.channel.name}
                  width={60}
                  height={60}
                  priority={index < 15}
                />
              </div>
              <div className="flex flex-col">
                {/* <div>{subscription.channel.name}</div> */}
                <div>{subscription.channel.name}</div>
                <div className="text-xs text-gray-400">
                  {subscription.channel.videoCount?.toLocaleString("de-DE")}
                  {" Videos ● "}
                  {subscription.channel.viewCount?.toLocaleString("de-DE")}
                  {" Views"}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
