
import { NextRequest, NextResponse } from 'next/server';
import { initializeNeo4j } from './app/api/services/neo4j';

let initializationStarted = false;

export async function middleware(request: NextRequest) {
  // Initialize Neo4j only once when the app starts
  if (!initializationStarted && request.nextUrl.pathname.startsWith('/api/')) {
    initializationStarted = true;
    try {
      await initializeNeo4j();
      console.log('Neo4j initialization completed via middleware');
    } catch (error) {
      console.error('Neo4j initialization failed:', error);
      // Don't block requests, but log the error
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*'
};
