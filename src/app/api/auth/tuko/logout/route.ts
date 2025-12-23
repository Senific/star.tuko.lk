import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revokeToken } from '@/lib/auth/tuko-oauth';

/**
 * POST /api/auth/tuko/logout
 * 
 * Logout endpoint - clears session and optionally revokes token with Tuko
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('tuko_session');
  
  // Try to revoke token with Tuko if we have a session
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value);
      if (session.accessToken) {
        await revokeToken(session.accessToken);
      }
    } catch (err) {
      // Log but don't fail - we still want to clear local session
      console.error('Error revoking token:', err);
    }
  }

  // Get return URL from request body
  let returnTo = '/';
  try {
    const body = await request.json();
    returnTo = body.returnTo || '/';
  } catch {
    // Ignore parsing errors, use default
  }

  // Create response
  const response = NextResponse.json({ success: true, redirectTo: returnTo });
  
  // Clear all auth cookies
  response.cookies.delete('tuko_session');
  response.cookies.delete('tuko_user');
  
  return response;
}

/**
 * GET /api/auth/tuko/logout
 * 
 * Alternative logout via GET (for simple links)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const returnTo = searchParams.get('returnTo') || '/';
  
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('tuko_session');
  
  // Try to revoke token with Tuko
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value);
      if (session.accessToken) {
        await revokeToken(session.accessToken);
      }
    } catch (err) {
      console.error('Error revoking token:', err);
    }
  }

  // Redirect response
  const response = NextResponse.redirect(new URL(returnTo, request.url));
  
  // Clear all auth cookies
  response.cookies.delete('tuko_session');
  response.cookies.delete('tuko_user');
  
  return response;
}
