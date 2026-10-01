import { NextResponse } from 'next/server';
import { getSpotifyAccessToken } from '../../../lib/spotify';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artistName = searchParams.get('artist')?.trim();

  if (!artistName) {
    return NextResponse.json({ error: 'Artist name is required.' }, { status: 400 });
  }

  try {
    const accessToken = await getSpotifyAccessToken();

    const artistResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!artistResponse.ok) {
      const errorText = await artistResponse.text();
      throw new Error(`Spotify search failed: ${artistResponse.status} ${errorText}`);
    }

    const artistData = await artistResponse.json();
    const artist = artistData.artists?.items?.[0];

    if (!artist) {
      return NextResponse.json({ error: `No artist found for "${artistName}".` }, { status: 404 });
    }

    const albumsResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(`artist:${artist.name}`)}&type=album&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!albumsResponse.ok) {
      const errorText = await albumsResponse.text();
      throw new Error(`Spotify albums request failed: ${albumsResponse.status} ${errorText}`);
    }

    const albumsData = await albumsResponse.json();

    const albums = (albumsData.albums?.items || []).map((album) => ({
      id: album.id,
      name: album.name,
      releaseDate: album.release_date,
      totalTracks: album.total_tracks,
      image: album.images?.[0]?.url || '',
      spotifyUrl: album.external_urls?.spotify || '',
      artist: album.artists?.[0]?.name || artist.name
    }));

    return NextResponse.json({
      artist: {
        name: artist.name,
        image: artist.images?.[0]?.url || '',
        spotifyUrl: artist.external_urls?.spotify || ''
      },
      albums
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong while fetching the albums.' },
      { status: 500 }
    );
  }
}
