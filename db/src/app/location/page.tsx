'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [ip, setIp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('/api/get-ip');
        if (!response.ok) throw new Error('Failed to fetch IP');
        const data = await response.json();
        setIp(data.ip);
      } catch (err) {
        setError('Error fetching IP');
      }
    };
    fetchIp();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold">Your IP Address</h1>
      {error ? (
        <p className="text-red-500 mt-2">{error}</p>
      ) : (
        <p className="text-lg mt-2">{ip || 'Loading...'}</p>
      )}
    </main>
  );
}