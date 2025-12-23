/**
 * Tuko OAuth Integration for Star.Tuko.lk (Beauty 2026)
 * 
 * This module handles OAuth 2.0 authentication with Tuko's authentication server.
 * Based on: Tuko OAuth 2.0 Integration Guide
 * 
 * OAuth 2.0 Flow:
 * 1. User clicks "Login with Tuko"
 * 2. Redirect to Tuko's authorization URL
 * 3. User authenticates on Tuko
 * 4. Tuko redirects back with authorization code
 * 5. Exchange code for access token
 * 6. Fetch user profile
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const TUKO_BASE_URL = 'https://tuko.senific.com/routes';

export const TUKO_OAUTH_CONFIG = {
  // OAuth endpoints (Tuko production)
  authorizationUrl: process.env.NEXT_PUBLIC_TUKO_AUTH_URL || `${TUKO_BASE_URL}/oauth/authorize`,
  tokenUrl: process.env.TUKO_TOKEN_URL || `${TUKO_BASE_URL}/oauth/token`,
  userInfoUrl: process.env.TUKO_USERINFO_URL || `${TUKO_BASE_URL}/oauth/userinfo`,
  revokeUrl: process.env.TUKO_REVOKE_URL || `${TUKO_BASE_URL}/oauth/revoke`,
  
  // Client credentials (register with Tuko admin)
  clientId: process.env.NEXT_PUBLIC_TUKO_CLIENT_ID || '',
  clientSecret: process.env.TUKO_CLIENT_SECRET || '',
  
  // Redirect URI - Must match what's registered with Tuko
  redirectUri: process.env.NEXT_PUBLIC_TUKO_REDIRECT_URI || 'https://star.tuko.lk/api/auth/tuko/callback',
  
  // Available scopes: 'profile' (default), 'phone' (optional)
  scopes: ['profile', 'phone'],
};

// =============================================================================
// TYPES
// =============================================================================

export interface TukoTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

/**
 * User profile response from Tuko's /oauth/userinfo endpoint
 */
export interface TukoUserProfile {
  sub: string;              // User ID (same as id)
  id: string;               // User ID
  name: string;             // Display name
  username: string;         // Unique username
  picture?: string;         // Avatar URL
  phone_number?: string;    // Phone (if 'phone' scope requested)
  phone_number_verified?: boolean;
  updated_at?: number;      // Unix timestamp
}

export interface TukoAuthSession {
  user: {
    id: string;
    name: string;
    username: string;
    phone?: string;
    profilePic?: string;
  };
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

// =============================================================================
// OAUTH FUNCTIONS
// =============================================================================

/**
 * Generate the Tuko OAuth authorization URL
 * @param state - CSRF protection state parameter (should be stored in session)
 */
export function getTukoAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: TUKO_OAUTH_CONFIG.clientId,
    redirect_uri: TUKO_OAUTH_CONFIG.redirectUri,
    scope: TUKO_OAUTH_CONFIG.scopes.join(' '),
    state: state,
  });
  
  return `${TUKO_OAUTH_CONFIG.authorizationUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<TukoTokenResponse> {
  const response = await fetch(TUKO_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: TUKO_OAUTH_CONFIG.clientId,
      client_secret: TUKO_OAUTH_CONFIG.clientSecret,
      redirect_uri: TUKO_OAUTH_CONFIG.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return response.json();
}

/**
 * Fetch user profile from Tuko API
 */
export async function fetchTukoUserProfile(accessToken: string): Promise<TukoUserProfile> {
  const response = await fetch(TUKO_OAUTH_CONFIG.userInfoUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch user profile: ${error}`);
  }

  return response.json();
}

/**
 * Refresh an expired access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TukoTokenResponse> {
  const response = await fetch(TUKO_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: TUKO_OAUTH_CONFIG.clientId,
      client_secret: TUKO_OAUTH_CONFIG.clientSecret,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  return response.json();
}

/**
 * Revoke access token (logout)
 */
export async function revokeToken(token: string): Promise<void> {
  try {
    await fetch(TUKO_OAUTH_CONFIG.revokeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token: token,
      }),
    });
  } catch (error) {
    console.error('Token revocation failed:', error);
  }
}

/**
 * Generate a random state parameter for CSRF protection
 */
export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate the state parameter matches what was stored
 */
export function validateState(received: string, stored: string): boolean {
  return received === stored && received.length > 0;
}
