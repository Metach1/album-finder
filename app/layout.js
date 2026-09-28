import './globals.css';

export const metadata = {
  title: 'Album Finder',
  description: 'Find albums by your favorite artist on Spotify.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
