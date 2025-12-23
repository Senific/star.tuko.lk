'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Admin phone numbers that are allowed to access admin panel
// Format: without country code prefix, just the number
const ADMIN_PHONE_NUMBERS = [
  '764092662',  // Super Admin
  '769770981',  // Moderator
];

// Admin roles
export type AdminRole = 'super_admin' | 'moderator' | 'content_manager';

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  phone?: string;
  profilePic?: string;
  role: AdminRole;
  permissions: string[];
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Helper to normalize phone number (remove +94, 0, spaces, etc.)
function normalizePhone(phone: string | undefined): string {
  if (!phone) return '';
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Remove country code if present (94 for Sri Lanka)
  if (digits.startsWith('94') && digits.length > 9) {
    return digits.slice(2);
  }
  // Remove leading 0 if present
  if (digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

// Check if phone number is an admin
function isAdminPhone(phone: string | undefined): boolean {
  const normalized = normalizePhone(phone);
  return ADMIN_PHONE_NUMBERS.includes(normalized);
}

// Get admin role based on phone
function getAdminRole(phone: string | undefined): AdminRole {
  const normalized = normalizePhone(phone);
  // First phone in list is super_admin
  if (normalized === ADMIN_PHONE_NUMBERS[0]) {
    return 'super_admin';
  }
  return 'moderator';
}

// Get permissions based on role
function getPermissions(role: AdminRole): string[] {
  switch (role) {
    case 'super_admin':
      return ['all'];
    case 'moderator':
      return ['view_contestants', 'approve_contestants', 'view_votes', 'view_reports'];
    case 'content_manager':
      return ['view_contestants', 'edit_content'];
    default:
      return [];
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in with Tuko and is an admin
  const checkAdminStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check Tuko session
      const response = await fetch('/api/auth/tuko/session', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.authenticated && data.user) {
        // Check if user's phone is in admin list
        if (isAdminPhone(data.user.phone)) {
          const role = getAdminRole(data.user.phone);
          const adminUser: AdminUser = {
            id: data.user.id,
            name: data.user.name,
            username: data.user.username,
            phone: data.user.phone,
            profilePic: data.user.profilePic,
            role,
            permissions: getPermissions(role),
          };
          setAdmin(adminUser);
          localStorage.setItem('beauty2026_admin', JSON.stringify(adminUser));
        } else {
          // User is logged in but not an admin
          setAdmin(null);
          setError('Your account does not have admin access');
          localStorage.removeItem('beauty2026_admin');
        }
      } else {
        // Not logged in
        setAdmin(null);
        localStorage.removeItem('beauty2026_admin');
      }
    } catch (err) {
      console.error('Admin auth check failed:', err);
      // Try to use cached admin data
      const savedAdmin = localStorage.getItem('beauty2026_admin');
      if (savedAdmin) {
        try {
          setAdmin(JSON.parse(savedAdmin));
        } catch {
          setAdmin(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  // Login - redirect to Tuko OAuth
  const login = () => {
    // Redirect to Tuko login, then back to admin
    window.location.href = `/api/auth/tuko/login?returnTo=/admin`;
  };

  // Logout
  const logout = async () => {
    try {
      await fetch('/api/auth/tuko/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ returnTo: '/admin' }),
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    setAdmin(null);
    localStorage.removeItem('beauty2026_admin');
  };

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    if (admin.permissions.includes('all')) return true;
    return admin.permissions.includes(permission);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout,
        hasPermission,
        error,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
