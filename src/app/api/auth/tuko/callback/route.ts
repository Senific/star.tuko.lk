import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  exchangeCodeForToken, 
  fetchTukoUserProfile, 
  validateState,
  TukoAuthSession 
} from '@/lib/auth/tuko-oauth';

/**
 * GET /api/auth/tuko/callback
 * 
 * OAuth callback endpoint - receives authorization code from Tuko
 * and exchanges it for tokens
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('Tuko OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    );
  }

  // Validate required parameters
  if (!code || !state) {
    console.error('Missing code or state in OAuth callback');
    return NextResponse.redirect(
      new URL('/login?error=invalid_callback', request.url)
    );
  }

  // Retrieve and validate state from cookie
  const cookieStore = await cookies();
  const stateCookie = cookieStore.get('tuko_oauth_state');
  
  if (!stateCookie) {
    console.error('Missing state cookie');
    return NextResponse.redirect(
      new URL('/login?error=session_expired', request.url)
    );
  }

  let storedState: string;
  let returnTo: string;
  
  try {
    const stateData = JSON.parse(Buffer.from(stateCookie.value, 'base64').toString());
    storedState = stateData.state;
    returnTo = stateData.returnTo || '/';
  } catch {
    console.error('Invalid state cookie format');
    return NextResponse.redirect(
      new URL('/login?error=invalid_state', request.url)
    );
  }

  // Validate state matches (CSRF protection)
  if (!validateState(state, storedState)) {
    console.error('State mismatch in OAuth callback');
    return NextResponse.redirect(
      new URL('/login?error=state_mismatch', request.url)
    );
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await exchangeCodeForToken(code);
    
    // Fetch user profile
    const userProfile = await fetchTukoUserProfile(tokenResponse.access_token);
    
    // Create session data (map Tuko profile to our format)
    const session: TukoAuthSession = {
      user: {
        id: userProfile.id || userProfile.sub,
        name: userProfile.name,
        username: userProfile.username,
        phone: userProfile.phone_number,
        profilePic: userProfile.picture,
      },
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: Date.now() + (tokenResponse.expires_in * 1000),
    };

    // Create redirect response
    const response = NextResponse.redirect(new URL(returnTo, request.url));
    
    // Set session cookie
    response.cookies.set('tuko_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenResponse.expires_in,
      path: '/',
    });

    // Set a non-httpOnly cookie for client-side user info (no sensitive data)
    response.cookies.set('tuko_user', JSON.stringify(session.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenResponse.expires_in,
      path: '/',
    });
    
    // Clear state cookie
    response.cookies.delete('tuko_oauth_state');
    
    return response;
    
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(
      new URL('/login?error=authentication_failed', request.url)
    );
  }
}
