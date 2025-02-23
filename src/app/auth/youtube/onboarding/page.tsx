"use server";

import db from "@/db";
import { channel, googleUser, googleUserSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import Image from "next/image";
import { getAllSubscriptionsWithChannels } from "@/utils/youtube-api";
import ClientChannels from "@/components/channel/client-select-channel-list";

export default async function Onboarding({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  }) {
  const accessToken = await searchParams.access_token;
  if (!accessToken || typeof accessToken !== "string") {
    return <div>No access token</div>;
  }
  if (!db) {
    throw new Error("Database not initialized");
  }

  const [user] = await db
    .select()
    .from(googleUser)
    .where(eq(googleUser.accessToken, accessToken));

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col items-center justify-center md:h-screen md:px-10 px-6 py-10">
        {user.profilePictureLink && (
          <div className=" bg-gray-200 rounded-full overflow-hidden border border-gray-300 mb-4">
            <Image
              src={user.profilePictureLink}
              alt="Profile Picture"
              width={150}
              height={150}
            />
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4">Hi {user.name} 🤩</h1>
        <p className="mb-4">We will now set up your account.</p>
      </div>
      <div className="flex flex-col gap-6 justify-center md:h-screen md:px-10 px-6 py-10">
        <Suspense
          fallback={<LoadingAnimation title="Fetching subscriptions" />}>
          <GetSubscriptions user={user} />
        </Suspense>
      </div>
    </div>
  );
}

async function GetSubscriptions({
  user,
}: {
  user: typeof googleUser.$inferSelect;
}) {
  const subscriptions = await getAllSubscriptionsWithChannels(user.accessToken);

  // Insert channels into the database
  // Insert them one by one to handle error if at least channel already exists
  await Promise.all(
    subscriptions.map(
      (s) =>
        new Promise(async (resolve) => {
          try {
            await db?.insert(channel).values(s.channel);
          } catch (error) {
            console.log(error);
          } finally {
            resolve(s);
          }
        })
    )
  );

  // Insert subscriptions into the database
  // Insert them one by one to handle error if at least subscription already exists
  await Promise.all(
    subscriptions.map(
      (s) =>
        new Promise(async (resolve) => {
          try {
            await db?.insert(googleUserSubscription).values({
              id: s.id,
              googleUserId: user.id,
              channelId: s.channel.id,
            });
          } catch (error) {
            console.log(error);
          } finally {
            resolve(s);
          }
        })
    )
  );

  return <ClientChannels subscriptions={subscriptions} />;
}

async function GetVideos({ accessToken }: { accessToken: string }) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <Suspense
      fallback={
        <>
          <Done title="Fetched subscriptions" />
          <Done title="Fetched videos" />
          <LoadingAnimation title="Creating playlists" />
        </>
      }>
      <CreatePlaylists accessToken={accessToken} />
    </Suspense>
  );
}

async function CreatePlaylists({ accessToken }: { accessToken: string }) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <>
      <Done title="Fetched subscriptions" />
      <Done title="Fetched videos" />
      <Done title="Created playlists" />
    </>
  );
}

function LoadingAnimation({ title }: { title: string }) {
  "use client";
  return (
    <div className="flex items-center gap-1.5 h-[28px] animate-pulse text-xl">
      <div className="animate-spin inline-block text-3xl">⛭</div>
      <div className="">{" " + title}</div>
    </div>
  );
}

function Soon({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 text-xl">
      <div className="">⏹️</div>
      <div className="">{" " + title}</div>
    </div>
  );
}

function Done({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 text-xl">
      <div className="">✅</div>
      <div className="">{" " + title}</div>
    </div>
  );
}

function Log(props: any) {
  console.log(props);
  return null;
}
