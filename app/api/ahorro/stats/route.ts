import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', module: 'ahorro-stats', version: 'v1' });
}
