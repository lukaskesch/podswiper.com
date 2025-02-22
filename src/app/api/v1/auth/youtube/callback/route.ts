import {
  buildGoogleUserFromTokenResponse,
  getAccessTokenFromCode,
} from "@/utils/google-o-auth";
import { googleUser } from "@/db/schema";
import db from "@/db";
import { eq } from "drizzle-orm";
export async function GET(request: Request) {
  // Get the code for the query string
  const url = new URL(request.url);
  const code = url.searchParams.get("code") as string;

  // Get the access token
  try {
    const response = await getAccessTokenFromCode(code);
    const user = await buildGoogleUserFromTokenResponse(response);

    // Check if the user exists in the database
    if (!db) {
      throw new Error("Database not initialized");
    }
    const [userFromDb] = await db
      .select()
      .from(googleUser)
      .where(eq(googleUser.id, user.id))
      .limit(1);

    if (!userFromDb) {
      await db.insert(googleUser).values(user);
    }

    return new Response(JSON.stringify(userFromDb), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error getting access token", { status: 500 });
  }
}
