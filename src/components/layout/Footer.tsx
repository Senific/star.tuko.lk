'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Crown, Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: '/contestants', label: t('nav.contestants') },
    { href: '/leaderboard', label: t('nav.leaderboard') },
    { href: '/about', label: t('nav.about') },
    { href: '/schedule', label: t('nav.schedule') },
    { href: '/results', label: t('nav.results') },
  ];

  const legalLinks = [
    { href: '/terms', label: t('footer.terms') },
    { href: '/privacy', label: t('footer.privacy') },
    { href: '/contact', label: t('footer.contact') },
  ];

  const socialLinks = [
    { href: 'https://web.facebook.com/profile.php?id=61585119140793', icon: Facebook, label: 'Facebook' },
    { href: 'https://youtube.com/@tuko_lk?si=poCbg4odx4IbTIkf', icon: Youtube, label: 'YouTube' },
  ];

  return (
    <footer className="bg-deep-purple-900 border-t border-royal-gold-500/20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-royal-gold-500" />
              <div>
                <span className="font-display text-xl font-bold text-gradient">Beauty 2026</span>
                <p className="text-xs text-royal-gold-500/70">star.tuko.lk</p>
              </div>
            </Link>
            <p className="text-white/60 text-sm">
              Sri Lanka's biggest online beauty contest. 25 districts, 9 provinces, 1 queen.
            </p>
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 
                           flex items-center justify-center text-white/60 
                           hover:border-royal-gold-500/50 hover:text-royal-gold-400 
                           transition-colors duration-200"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-royal-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-white/60 text-sm">
                <Phone className="h-4 w-4 text-royal-gold-500" />
                <a href="tel:+94764092662" className="hover:text-royal-gold-400 transition-colors">+94 764092662</a>
              </li>
              <li className="flex items-center space-x-3 text-white/60 text-sm">
                <Mail className="h-4 w-4 text-royal-gold-500" />
                <a href="mailto:senificofficial@gmail.com" className="hover:text-royal-gold-400 transition-colors">senificofficial@gmail.com</a>
              </li>
              <li className="flex items-start space-x-3 text-white/60 text-sm">
                <MapPin className="h-4 w-4 text-royal-gold-500 mt-0.5" />
                <span>Sri Lanka</span>
              </li>
            </ul>
          </div>

          {/* Download Tuko */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Get Tuko App</h3>
            <p className="text-white/60 text-sm mb-4">
              Download Tuko to register and vote in Beauty 2026.
            </p>
            <div className="flex flex-col space-y-2">
              <a
                href="https://play.google.com/store/apps/details?id=com.senific.tuko"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-white/5 border border-white/10 
                         rounded-lg px-4 py-2 hover:border-royal-gold-500/30 transition-colors"
              >
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 2H6.477C5.104 2 4 3.104 4 4.477v15.046C4 20.896 5.104 22 6.477 22h11.046C18.896 22 20 20.896 20 19.523V4.477C20 3.104 18.896 2 17.523 2zM12 19.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm5-4H7V5h10v10.5z"/>
                </svg>
                <div>
                  <p className="text-[10px] text-white/50">Download on</p>
                  <p className="text-sm font-semibold text-white">Google Play</p>
                </div>
              </a>
              <div
                className="flex items-center space-x-2 bg-white/5 border border-white/10 
                         rounded-lg px-4 py-2 opacity-60 cursor-not-allowed"
              >
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <p className="text-[10px] text-white/50">Coming Soon</p>
                  <p className="text-sm font-semibold text-white">App Store</p>
                </div>
              </div>
              <a
                href="https://tuko.lk/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-royal-gold-500/10 border border-royal-gold-500/30 
                         rounded-lg px-4 py-2 hover:border-royal-gold-500/50 transition-colors"
              >
                <svg className="h-6 w-6 text-royal-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <div>
                  <p className="text-[10px] text-royal-gold-400/70">Use on</p>
                  <p className="text-sm font-semibold text-royal-gold-400">Web (tuko.lk)</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <p className="text-white/40 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-2 text-white/40 text-sm">
              <span>{t('footer.powered_by')}</span>
              <span className="text-royal-gold-500 font-semibold">Tuko</span>
            </div>
            <div className="flex items-center space-x-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/40 hover:text-royal-gold-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
