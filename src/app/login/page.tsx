'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { user, isLoading, login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const error = searchParams.get('error');
  const returnTo = searchParams.get('returnTo') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(returnTo);
    }
  }, [isAuthenticated, user, router, returnTo]);

  const handleLogin = () => {
    login(returnTo);
  };

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'invalid_callback':
        return 'Invalid authentication callback. Please try again.';
      case 'session_expired':
        return 'Your session has expired. Please login again.';
      case 'state_mismatch':
        return 'Security validation failed. Please try again.';
      case 'authentication_failed':
        return 'Authentication failed. Please try again.';
      default:
        return errorCode || null;
    }
  };

  const errorMessage = getErrorMessage(error);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-pink-500" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Beauty 2026
          </h1>
          <p className="text-gray-600 mt-2">Sri Lanka&apos;s Biggest Online Beauty Contest</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Welcome
          </h2>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{errorMessage}</p>
            </div>
          )}

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Smartphone className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Quick & Easy</h3>
                <p className="text-sm text-gray-600">Login with your Tuko account in seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Secure Authentication</h3>
                <p className="text-sm text-gray-600">Your data is protected with Tuko&apos;s secure login</p>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Login with Tuko
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">Powered by Tuko</span>
            </div>
          </div>

          {/* Info Text */}
          <p className="text-center text-sm text-gray-500">
            By logging in, you agree to our{' '}
            <a href="/terms" className="text-pink-500 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-pink-500 hover:underline">Privacy Policy</a>
          </p>
        </div>

        {/* Help Link */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Don&apos;t have a Tuko account?{' '}
          <a 
            href="https://tuko.lk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-500 hover:underline font-medium"
          >
            Get Tuko App
          </a>
        </p>
      </div>
    </div>
  );
}
