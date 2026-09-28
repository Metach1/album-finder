# Album Finder

A polished Next.js app that searches Spotify for an artist and displays their albums in a modern, deployment-ready interface.

## Features
- Search by artist name
- Fetch artist and album data from the Spotify API
- Show album covers, release dates, and track counts
- Open each album or artist directly in Spotify
- Production-friendly Next.js app structure for deployment on Vercel or other Node hosts

## Setup
1. Install dependencies:
   npm install
2. Add your Spotify credentials to a .env.local file:
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
3. Start the app:
   npm run dev
4. Open http://localhost:3000 in your browser

## Deploy
This app is ready to deploy on Vercel. Add the same environment variables in your Vercel project settings:
- SPOTIFY_CLIENT_ID
- SPOTIFY_CLIENT_SECRET

## Project structure
- app/page.js: Search UI
- app/api/albums/route.js: Spotify API route
- app/layout.js: App shell
- app/globals.css: Styling
- next.config.mjs: Deployment-friendly Next.js config

## Tech stack
- JavaScript
- Next.js
- Spotify Web API
