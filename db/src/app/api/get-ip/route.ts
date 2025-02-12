import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Extract the IP address from the headers
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] || // For proxies or load balancers
    req.headers.get('x-real-ip') || // Another common header for IPs
    'Unable to determine IP';

  return NextResponse.json({ ip });
}
