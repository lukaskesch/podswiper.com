import { requiredScopes } from "@/constants/required-scopes";
import { googleUser } from "@/db/schema";
import {
  addSecondsToDate,
  convertDateToMySqlDate,
} from "@/utils/date-time-converter";
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
    redirect_uri: getEnv("AUTH_GOOGLE_REDIRECT_URI"),
    client_id: getEnv("AUTH_GOOGLE_ID"),
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: requiredScopes.join(" "),
  };
  const auth_uri = "https://accounts.google.com/o/oauth2/v2/auth";
  const queryString = new URLSearchParams(queryOptions).toString();
  return `${auth_uri}?${queryString}`;
}

export function checkForRequiredScopes(scopes: string[]) {
  return requiredScopes.every((scope) => scopes.includes(scope));
}

export async function getAccessTokenFromCode(code: string) {
  const body = new URLSearchParams({
    client_id: getEnv("AUTH_GOOGLE_ID"),
    client_secret: getEnv("AUTH_GOOGLE_SECRET"),
    grant_type: "authorization_code",
    code: code,
    redirect_uri: getEnv("AUTH_GOOGLE_REDIRECT_URI"),
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
