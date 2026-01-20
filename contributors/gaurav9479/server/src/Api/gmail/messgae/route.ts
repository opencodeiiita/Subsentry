import { NextResponse } from "next/server";
import { getValidAccessToken } from "../gmailClient";

export async function GET() {
  const user = await getUserWithTokens(); // from DB
  const accessToken = await getValidAccessToken(user);

  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch Gmail messages" },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}

async function getUserWithTokens() {
  return {
    id: "user123",
    accessToken: "stored_access_token",
    refreshToken: "stored_refresh_token",
    expiresAt: Date.now() - 1000,
  };
}
