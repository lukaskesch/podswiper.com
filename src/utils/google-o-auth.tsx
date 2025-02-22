import { googleUser } from "@/db/schema";
import { addSecondsToDate, convertDateToMySqlDate } from "@/utils/date-time-converter";
import { getEnv } from "@/utils/get-env";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}

const token_uri = "https://oauth2.googleapis.com/token";

export function getGoogleOAuthURL() {
  const queryOptions = {
    redirect_uri: getEnv("GOOGLE_OAUTH_REDIRECT_URI"),
    client_id: getEnv("GOOGLE_OAUTH_CLIENT_ID"),
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ].join(" "),
  };
  const auth_uri = "https://accounts.google.com/o/oauth2/v2/auth";
  const queryString = new URLSearchParams(queryOptions).toString();
  return `${auth_uri}?${queryString}`;
}

export async function getAccessTokenFromCode(code: string) {
  const body = new URLSearchParams({
    client_id: getEnv("GOOGLE_OAUTH_CLIENT_ID"),
    client_secret: getEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
    grant_type: "authorization_code",
    code: code,
    redirect_uri: getEnv("GOOGLE_OAUTH_REDIRECT_URI"),
  }).toString();
  return await fetchAccessToken(body);
}

export async function fetchAccessToken(body: string): Promise<TokenResponse> {
  try {
    const response = await fetch(token_uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error getting access token");
  }
}

export function buildGoogleUserFromTokenResponse(
  response: TokenResponse
): typeof googleUser.$inferInsert {
  const decoded = jwt.decode(response.id_token) as JwtPayload;
  if (!decoded.sub) {
    throw new Error("Invalid ID token");
  }
  return {
    id: decoded.sub,
    email: decoded.email,
    name: decoded.name,
    profilePictureLink: decoded.picture,
    accessToken: response.access_token,
    accessTokenExpiresAt: convertDateToMySqlDate(
      addSecondsToDate(new Date(), response.expires_in)
    ),
    refreshToken: response.refresh_token,
    authorizedScopes: response.scope,
    mayWatchPlaylistId: null,
    mustWatchPlaylistId: null,
  };
}
