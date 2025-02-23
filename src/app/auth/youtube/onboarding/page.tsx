"use server";

import db from "@/db";
import { googleUser } from "@/db/schema";
import { eq } from "drizzle-orm";
export default async function Onboarding({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams.access_token || typeof searchParams.access_token !== "string") {
    return <div>No access token</div>;
  }
  if (!db) {
    throw new Error("Database not initialized");
  }
  const [user] = await db
    .select()
    .from(googleUser)
    .where(eq(googleUser.accessToken, searchParams.access_token));
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Hi {user.name}</h1>
      <p className="">
        Our robots will now start retrieving your Subscriptions and their videos.
      </p>
    </div>
  );
}
