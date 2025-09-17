import { NextResponse } from 'next/server';

export async function GET() {
  const stats = {
    total: 0,
    by_specialization: {},
    by_university: {},
    by_level: {},
    recent: 0,
  };
  return NextResponse.json(stats);
}

export const dynamic = 'force-dynamic';

