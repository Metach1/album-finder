# Album Finder

Album Finder searches Spotify for an artist and lets you browse their albums and each album's songs.

## Features

- Search Spotify by artist name
- Browse album covers, release dates, and track counts
- Select an album to see its songs and open tracks on Spotify
- Open artist and album pages directly on Spotify

## Requirements

- Node.js 18.17 or newer
- npm
- A Spotify app with a client ID and client secret

## Run locally

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Create a Spotify app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and copy its client ID and client secret.
3. Copy `.env.example` to `.env.local` and enter the credentials:

   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

   On PowerShell, copy the template with:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Keep these credentials server-side. Do not add a `NEXT_PUBLIC_` prefix or commit `.env.local`.

4. Start the development server:

   ```sh
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push the project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected **Next.js** framework and default build settings.
4. In the project’s **Settings → Environment Variables**, add:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`

   Add the variables to each environment where the app will run (Production, Preview, and/or Development). Use the values from your Spotify app; never put real credentials in the repository.

5. Deploy the project. After changing environment variables, redeploy so the new values are available to the server.

The app uses Next.js server routes to call Spotify, so it needs a Next.js-capable host and cannot be deployed as a static export. For another Node.js host, use `npm ci`, set the same environment variables, then run `npm run build` and `npm start`.

## Project structure

- `app/page.js` — artist search and album/song interface
- `app/api/albums/route.js` — Spotify artist and album search
- `app/api/albums/[albumId]/tracks/route.js` — Spotify album tracks
- `lib/spotify.js` — shared Spotify authentication
- `app/globals.css` — application styles
- `vercel.json` — Vercel framework configuration
