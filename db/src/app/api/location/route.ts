// app/api/location/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    const token = process.env.NEXT_PUBLIC_IPINFO_TOKEN; // Move API key to .env
    const url = `https://ipinfo.io/json?token=${token}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch IP info');
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Error fetching location' }, { status: 500 });
    }
}
