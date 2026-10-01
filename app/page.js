'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [artist, setArtist] = useState('');
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(false);
  const [tracksError, setTracksError] = useState('');

  useEffect(() => {
    if (!selectedAlbum) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadTracks() {
      setTracks([]);
      setTracksError('');
      setTracksLoading(true);

      try {
        const response = await fetch(`/api/albums/${encodeURIComponent(selectedAlbum.id)}/tracks`, {
          signal: controller.signal
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to fetch album tracks.');
        }

        setTracks(data.tracks);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setTracksError(error.message || 'Something went wrong while loading tracks.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setTracksLoading(false);
        }
      }
    }

    loadTracks();
    return () => controller.abort();
  }, [selectedAlbum]);

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
            Search an artist and browse their albums. Select any album to see its songs and open
            tracks or albums directly on Spotify.
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
                <button
                  className="album-select"
                  type="button"
                  onClick={() => setSelectedAlbum(album)}
                  aria-label={`View songs on ${album.name}`}
                >
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
                    <span className="album-action">View songs</span>
                  </div>
                </button>

                <div className="album-spotify-link">
                  <a href={album.spotifyUrl} target="_blank" rel="noreferrer">
                    Open on Spotify
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {selectedAlbum ? (
        <div
          className="dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedAlbum(null);
            }
          }}
        >
          <section
            className="tracks-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tracks-title"
          >
            <button
              className="dialog-close"
              type="button"
              onClick={() => setSelectedAlbum(null)}
              aria-label="Close album songs"
            >
              ×
            </button>

            <div className="tracks-heading">
              {selectedAlbum.image ? (
                <img src={selectedAlbum.image} alt="" />
              ) : null}
              <div>
                <p className="section-label">Album songs</p>
                <h2 id="tracks-title">{selectedAlbum.name}</h2>
                <p>{selectedAlbum.artist}</p>
              </div>
            </div>

            {tracksLoading ? <p className="tracks-message">Loading songs...</p> : null}
            {tracksError ? <p className="tracks-message tracks-error">{tracksError}</p> : null}
            {!tracksLoading && !tracksError && tracks.length === 0 ? (
              <p className="tracks-message">No songs were found for this album.</p>
            ) : null}

            {!tracksLoading && tracks.length > 0 ? (
              <ol className="track-list">
                {tracks.map((track) => (
                  <li key={track.id}>
                    <span className="track-number">{track.trackNumber}</span>
                    <div className="track-copy">
                      <span className="track-name">{track.name}</span>
                      <span className="track-artists">{track.artists.join(', ')}</span>
                    </div>
                    {track.spotifyUrl ? (
                      <a href={track.spotifyUrl} target="_blank" rel="noreferrer">
                        Spotify
                      </a>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : null}
          </section>
        </div>
      ) : null}
    </main>
  );
}
