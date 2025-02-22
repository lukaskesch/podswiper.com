import {
  buildGoogleUserFromTokenResponse,
  getAccessTokenFromCode,
} from "@/utils/google-o-auth";

export async function GET(request: Request) {
  // Get the code for the query string
  const url = new URL(request.url);
  const code = url.searchParams.get("code") as string;

  // Get the access token
  try {
    const response = await getAccessTokenFromCode(code);
    const user = await buildGoogleUserFromTokenResponse(response);
    console.log(user.access_token_expires_at);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error getting access token", { status: 500 });
  }
}
