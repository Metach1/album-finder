'use client';

import { useState } from 'react';

export default function HomePage() {
  const [artist, setArtist] = useState('');
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedArtist = artist.trim();

    if (!trimmedArtist) {
      setStatus('Please enter an artist name.');
      setResult(null);
      return;
    }

    setLoading(true);
    setStatus('Searching Spotify...');
    setResult(null);

    try {
      const response = await fetch(`/api/albums?artist=${encodeURIComponent(trimmedArtist)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to fetch albums.');
      }

      setStatus(`Showing albums for ${data.artist.name}.`);
      setResult(data);
    } catch (error) {
      setStatus(error.message || 'Something went wrong.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="panel hero-panel">
        <div className="hero-copy">
          <span className="badge">Spotify album explorer</span>
          <h1>Find albums by your favorite artist</h1>
          <p>
            Search an artist and instantly browse their album catalog, release dates, track counts,
            and direct Spotify links.
          </p>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="artist-input">
            Artist name
          </label>
          <input
            id="artist-input"
            type="text"
            placeholder="Search for an artist..."
            value={artist}
            onChange={(event) => setArtist(event.target.value)}
            autoComplete="off"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </section>

      {status ? <section className="status-panel">{status}</section> : null}

      {result ? (
        <section className="results-wrap">
          <div className="artist-header">
            {result.artist.image ? (
              <img className="artist-image" src={result.artist.image} alt={result.artist.name} />
            ) : (
              <div className="artist-image placeholder">Artist</div>
            )}

            <div>
              <p className="section-label">Artist</p>
              <h2>{result.artist.name}</h2>
              {result.artist.spotifyUrl ? (
                <a href={result.artist.spotifyUrl} target="_blank" rel="noreferrer">
                  View artist on Spotify
                </a>
              ) : null}
            </div>
          </div>

          <div className="album-grid">
            {result.albums.map((album) => (
              <article className="album-card" key={album.id}>
                <div className="album-art">
                  {album.image ? (
                    <img src={album.image} alt={`${album.name} cover`} />
                  ) : (
                    <div className="album-placeholder">No cover</div>
                  )}
                </div>

                <div className="album-info">
                  <h3>{album.name}</h3>
                  <p>Released: {album.releaseDate || 'Unknown'}</p>
                  <p>Tracks: {album.totalTracks || 'N/A'}</p>
                  <a href={album.spotifyUrl} target="_blank" rel="noreferrer">
                    Open on Spotify
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
