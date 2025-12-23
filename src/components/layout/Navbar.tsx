'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X, Crown, User, LogOut, Globe } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { user, isAuthenticated, login, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/contestants', label: t('nav.contestants') },
    { href: '/leaderboard', label: t('nav.leaderboard') },
    { href: '/about', label: t('nav.about') },
    { href: '/schedule', label: t('nav.schedule') },
    { href: '/results', label: t('nav.results') },
  ];

  const languages = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', label: 'தமிழ்', flag: '🇱🇰' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-deep-purple-900/95 backdrop-blur-md border-b border-royal-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Crown className="h-8 w-8 text-royal-gold-500 group-hover:animate-pulse" />
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-gradient">
                Beauty 2026
              </span>
              <span className="text-[10px] text-royal-gold-500/70 -mt-1">
                star.tuko.lk
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-royal-gold-400 
                         transition-colors duration-200 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Language & Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-white/80 
                         hover:text-royal-gold-400 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>{languages.find(l => l.code === language)?.flag}</span>
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-deep-purple-800 border border-royal-gold-500/20 
                              rounded-lg shadow-xl overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2
                                hover:bg-royal-gold-500/10 transition-colors
                                ${language === lang.code ? 'text-royal-gold-400 bg-royal-gold-500/5' : 'text-white/80'}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/register"
                  className="btn-secondary text-sm py-2 px-4"
                >
                  {t('nav.register')}
                </Link>
                <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-full">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="" className="h-6 w-6 rounded-full" />
                  ) : (
                    <User className="h-5 w-5 text-royal-gold-400" />
                  )}
                  <span className="text-sm text-white/90">{user?.name?.split(' ')[0]}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="p-2 text-white/60 hover:text-hot-pink-400 transition-colors"
                  title={t('nav.logout')}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => login()}
                className="btn-primary text-sm py-2 px-6 flex items-center space-x-2"
              >
                <span>{t('nav.login')}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white/80 hover:text-royal-gold-400"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-white/80 hover:text-royal-gold-400 
                           hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="px-4 py-3 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors
                                ${language === lang.code 
                                  ? 'bg-royal-gold-500 text-deep-purple-900' 
                                  : 'bg-white/10 text-white/70'}`}
                    >
                      {lang.flag} {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Auth */}
              <div className="px-4 py-3 border-t border-white/10">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-royal-gold-400" />
                      <span className="text-white/90">{user?.name}</span>
                    </div>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="btn-secondary text-center"
                    >
                      {t('nav.register')}
                    </Link>
                    <button onClick={() => logout()} className="btn-secondary flex items-center justify-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                ) : (
                  <button onClick={() => login()} className="btn-primary w-full">
                    {t('nav.login')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
