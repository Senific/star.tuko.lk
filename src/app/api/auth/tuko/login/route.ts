import { NextResponse } from 'next/server';
import { getTukoAuthorizationUrl, generateState } from '@/lib/auth/tuko-oauth';

/**
 * GET /api/auth/tuko/login
 * 
 * Initiates the Tuko OAuth flow by redirecting to Tuko's authorization page
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get('returnTo') || '/';
  
  // Generate state for CSRF protection
  const state = generateState();
  
  // Store state and return URL in a cookie (will be validated on callback)
  const stateData = JSON.stringify({ state, returnTo });
  const encodedState = Buffer.from(stateData).toString('base64');
  
  // Get the authorization URL
  const authUrl = getTukoAuthorizationUrl(state);
  
  // Create response with redirect
  const response = NextResponse.redirect(authUrl);
  
  // Set state cookie (httpOnly, secure in production)
  response.cookies.set('tuko_oauth_state', encodedState, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });
  
  return response;
}
