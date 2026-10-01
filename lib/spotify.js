export async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials are missing. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to your .env file.');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Spotify authentication failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error('Spotify did not return an access token.');
  }

  return data.access_token;
}
