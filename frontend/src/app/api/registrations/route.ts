import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ registrations: [] });
}

export const dynamic = 'force-dynamic';

