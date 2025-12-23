'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Crown, Shield, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, error } = useAdminAuth();

  // Redirect if already logged in as admin
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-royal-gold-400 mx-auto animate-spin" />
          <p className="text-white/60 mt-4">Checking admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Crown className="h-16 w-16 text-royal-gold-400 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-gradient">Beauty 2026</h1>
          <p className="text-white/60 mt-2">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="card-glow p-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-royal-gold-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">
              Admin Access
            </h2>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/30 
                          rounded-lg mb-6 text-red-400 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-white/60 text-center mb-6">
            Login with your Tuko account to access the admin panel.
            Only authorized administrators can access this area.
          </p>

          {/* Login with Tuko Button */}
          <button
            onClick={() => login()}
            className="btn-primary w-full py-4 flex items-center justify-center space-x-2 text-lg"
          >
            <span>Login with Tuko</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/40 text-xs text-center">
              Admin access is restricted to authorized personnel only.
              <br />
              Contact support if you need access.
            </p>
          </div>
        </div>

        {/* Back to site */}
        <p className="text-center mt-6">
          <a href="/" className="text-white/40 hover:text-royal-gold-400 text-sm">
            ← Back to main site
          </a>
        </p>
      </div>
    </div>
  );
}
