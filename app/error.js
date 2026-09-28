'use client';

export default function Error({ error, reset }) {
  return (
    <main style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h2>Something went wrong.</h2>
      <p>{error?.message || 'An unexpected error occurred.'}</p>
      <button onClick={() => reset()}>Try again</button>
    </main>
  );
}
