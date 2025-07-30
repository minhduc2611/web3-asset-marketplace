import { NextResponse } from 'next/server';
import { checkNeo4jHealth } from '@/app/api/services/neo4j';

export async function GET() {
  try {
    const health = await checkNeo4jHealth();
    const status = health.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(health, { status });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 