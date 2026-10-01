import { NextResponse } from 'next/server';
import { getSpotifyAccessToken } from '../../../../../lib/spotify';

export async function GET(request, { params }) {
  const { albumId } = params;

  if (!albumId || !/^[\da-z]+$/i.test(albumId)) {
    return NextResponse.json({ error: 'A valid album ID is required.' }, { status: 400 });
  }

  try {
    const accessToken = await getSpotifyAccessToken();
    const spotifyTracks = [];
    let offset = 0;
    let total = Infinity;

    while (offset < total) {
      const response = await fetch(
        `https://api.spotify.com/v1/albums/${encodeURIComponent(albumId)}/tracks?limit=50&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Spotify tracks request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const page = data.items || [];
      spotifyTracks.push(...page);
      total = data.total ?? offset + page.length;

      if (page.length === 0) {
        break;
      }

      offset += page.length;
    }

    const tracks = spotifyTracks.map((track) => ({
      id: track.id,
      name: track.name,
      trackNumber: track.track_number,
      spotifyUrl: track.external_urls?.spotify || '',
      artists: (track.artists || []).map((artist) => artist.name)
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong while fetching album tracks.' },
      { status: 500 }
    );
  }
}
