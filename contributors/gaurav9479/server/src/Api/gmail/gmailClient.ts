import { refreshAccessToken } from "./tokens";

export async function getValidAccessToken(user: any) {
  if (Date.now() < user.expiresAt) {
    return user.accessToken;
  }

  const refreshed = await refreshAccessToken(user.refreshToken);

  await updateStoredToken(user.id, {
    accessToken: refreshed.access_token,
    expiresAt: Date.now() + refreshed.expires_in * 1000,
  });

  return refreshed.access_token;
}


async function updateStoredToken(
  userId: string,
  data: { accessToken: string; expiresAt: number }
) {}
