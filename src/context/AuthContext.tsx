'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Tuko User Interface (matches Tuko OAuth userinfo response)
export interface TukoUser {
  id: string;
  name: string;
  username: string;
  phone?: string;
  profilePic?: string;
  // App-specific fields (set by Beauty 2026)
  isContestant?: boolean;
  contestantId?: string;
}

interface AuthContextType {
  user: TukoUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (returnTo?: string) => void;
  logout: (returnTo?: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  // For development/testing only
  mockLogin: (user: TukoUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cookie helper to read non-httpOnly cookies
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TukoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check session with the server
  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      // First, try to read user from cookie (faster)
      const userCookie = getCookie('tuko_user');
      if (userCookie) {
        try {
          const userData = JSON.parse(userCookie);
          setUser(userData);
        } catch {
          // Invalid cookie format, will verify with server
        }
      }

      // Verify session with server (also handles token refresh)
      const response = await fetch('/api/auth/tuko/session', {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // On error, try to use cached user from localStorage as fallback
      const savedUser = localStorage.getItem('beauty2026_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Sync user to localStorage when it changes (for offline access)
  useEffect(() => {
    if (user) {
      localStorage.setItem('beauty2026_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('beauty2026_user');
    }
  }, [user]);

  /**
   * Initiate Tuko OAuth login
   * @param returnTo - URL to redirect to after successful login
   */
  const login = (returnTo?: string) => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    // Ensure returnTo is a string (guard against event objects being passed accidentally)
    const redirectPath = (typeof returnTo === 'string' && returnTo) ? returnTo : currentPath;
    
    // Redirect to Tuko OAuth login endpoint
    window.location.href = `/api/auth/tuko/login?returnTo=${encodeURIComponent(redirectPath)}`;
  };

  /**
   * Logout and clear session
   * @param returnTo - URL to redirect to after logout
   */
  const logout = async (returnTo?: string) => {
    try {
      await fetch('/api/auth/tuko/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ returnTo: returnTo || '/' }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear local state
    setUser(null);
    localStorage.removeItem('beauty2026_user');
    
    // Redirect if returnTo specified
    if (returnTo) {
      window.location.href = returnTo;
    }
  };

  /**
   * Manually refresh the session
   */
  const refreshSession = async () => {
    await checkAuthStatus();
  };

  // For development/testing purposes
  const mockLogin = (mockUser: TukoUser) => {
    setUser(mockUser);
    localStorage.setItem('beauty2026_user', JSON.stringify(mockUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshSession,
        mockLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
