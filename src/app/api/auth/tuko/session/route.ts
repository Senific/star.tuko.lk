import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshAccessToken, fetchTukoUserProfile, TukoAuthSession } from '@/lib/auth/tuko-oauth';

/**
 * GET /api/auth/tuko/session
 * 
 * Returns current session info. Refreshes token if needed.
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('tuko_session');
  
  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const session: TukoAuthSession = JSON.parse(sessionCookie.value);
    
    // Check if token is expired or about to expire (within 5 minutes)
    const isExpired = session.expiresAt < (Date.now() + 5 * 60 * 1000);
    
    if (isExpired && session.refreshToken) {
      // Attempt to refresh the token
      try {
        const tokenResponse = await refreshAccessToken(session.refreshToken);
        
        // Verify the new token works by fetching user profile
        const userProfile = await fetchTukoUserProfile(tokenResponse.access_token);
        
        // Update session with new tokens and refreshed user data
        const newSession: TukoAuthSession = {
          user: {
            id: userProfile.id || userProfile.sub,
            name: userProfile.name,
            username: userProfile.username,
            phone: userProfile.phone_number,
            profilePic: userProfile.picture,
          },
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token || session.refreshToken,
          expiresAt: Date.now() + (tokenResponse.expires_in * 1000),
        };
        
        const response = NextResponse.json({
          authenticated: true,
          user: newSession.user,
        });
        
        // Update session cookie
        response.cookies.set('tuko_session', JSON.stringify(newSession), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: tokenResponse.expires_in,
          path: '/',
        });
        
        // Update user cookie
        response.cookies.set('tuko_user', JSON.stringify(newSession.user), {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: tokenResponse.expires_in,
          path: '/',
        });
        
        return response;
        
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear invalid session
        const response = NextResponse.json({ authenticated: false, user: null });
        response.cookies.delete('tuko_session');
        response.cookies.delete('tuko_user');
        return response;
      }
    }
    
    if (isExpired) {
      // Token expired and no refresh token
      const response = NextResponse.json({ authenticated: false, user: null });
      response.cookies.delete('tuko_session');
      response.cookies.delete('tuko_user');
      return response;
    }
    
    // Token is still valid
    return NextResponse.json({
      authenticated: true,
      user: session.user,
    });
    
  } catch (err) {
    console.error('Session parse error:', err);
    
    const response = NextResponse.json({ authenticated: false, user: null });
    response.cookies.delete('tuko_session');
    response.cookies.delete('tuko_user');
    return response;
  }
}
