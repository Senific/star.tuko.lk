'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Crown, Star, Users, MapPin, Trophy, ArrowRight, 
  Sparkles, Download, Vote, Camera, ChevronRight
} from 'lucide-react';
import ContestantCard from '@/components/contestants/ContestantCard';
import { districts, provinces } from '@/data/locations';

// Contestant type for home page
interface ContestantData {
  id: string;
  name: string;
  age: number;
  bio: string;
  profilePhoto: string;
  districtId: string;
  district?: string;
  provinceId?: string;
  province?: string;
  votes: number;
  talents: string[];
  status?: string;
}

export default function HomePage() {
  const { t, language } = useLanguage();
  const { isAuthenticated, login } = useAuth();
  
  // Countdown to March 20, 2026
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [featuredContestants, setFeaturedContestants] = useState<ContestantData[]>([]);
  const [votingEnabled, setVotingEnabled] = useState(false);
  const [loadingContestants, setLoadingContestants] = useState(true);

  useEffect(() => {
    const targetDate = new Date('2026-03-20T00:00:00').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch featured contestants and voting status
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch voting status
        const votingRes = await fetch('/api/settings/voting-status');
        const votingData = await votingRes.json();
        setVotingEnabled(votingData.votingEnabled);

        // Fetch contestants
        const contestantsRes = await fetch('/api/contestants?sortBy=votes&limit=6');
        const contestantsData = await contestantsRes.json();
        setFeaturedContestants(contestantsData.contestants || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingContestants(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { icon: MapPin, value: '25', label: t('hero.districts') },
    { icon: Users, value: '9', label: t('hero.provinces') },
    { icon: Crown, value: '1', label: t('hero.one_queen') },
  ];

  const howItWorks = [
    { icon: Download, title: t('howItWorks.step1_title'), desc: t('howItWorks.step1_desc') },
    { icon: Camera, title: t('howItWorks.step2_title'), desc: t('howItWorks.step2_desc') },
    { icon: Vote, title: t('howItWorks.step3_title'), desc: t('howItWorks.step3_desc') },
    { icon: Trophy, title: t('howItWorks.step4_title'), desc: t('howItWorks.step4_desc') },
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-hero-gradient opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-royal-gold-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-hot-pink-500/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-32 right-20 hidden lg:block animate-float">
          <Crown className="h-16 w-16 text-royal-gold-400/30" />
        </div>
        <div className="absolute bottom-40 left-20 hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
          <Star className="h-12 w-12 text-royal-gold-400/20" />
        </div>
        <div className="absolute top-1/2 right-40 hidden lg:block animate-float" style={{ animationDelay: '4s' }}>
          <Sparkles className="h-8 w-8 text-hot-pink-400/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Crown Animation */}
          <div className="mb-6 animate-crown inline-block">
            <Crown className="h-20 w-20 lg:h-28 lg:w-28 text-royal-gold-400 mx-auto" />
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
            <span className="text-gradient">{t('hero.title')}</span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-white/80 mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <stat.icon className="h-5 w-5 text-royal-gold-400" />
                  <span className="text-3xl md:text-4xl font-bold text-white">{stat.value}</span>
                </div>
                <span className="text-sm text-white/60">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {isAuthenticated ? (
              <Link href="/register" className="btn-primary text-lg px-10 py-4 flex items-center space-x-2">
                <span>{t('hero.cta_register')}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <button onClick={() => login()} className="btn-primary text-lg px-10 py-4 flex items-center space-x-2">
                <span>{t('hero.cta_register')}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
            <Link href="/contestants" className="btn-secondary text-lg px-10 py-4 flex items-center space-x-2">
              <span>{t('hero.cta_vote')}</span>
              <Vote className="h-5 w-5" />
            </Link>
          </div>

          {/* Countdown */}
          <div className="glass-card inline-block px-8 py-6">
            <p className="text-royal-gold-400 text-sm font-medium mb-3">{t('countdown.title')}</p>
            <div className="flex items-center justify-center gap-4">
              {[
                { value: countdown.days, label: t('countdown.days') },
                { value: countdown.hours, label: t('countdown.hours') },
                { value: countdown.minutes, label: t('countdown.minutes') },
                { value: countdown.seconds, label: t('countdown.seconds') },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-deep-purple-800 rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[60px]">
                    <span className="text-2xl md:text-3xl font-bold text-gradient">
                      {String(item.value).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs text-white/50 mt-1 block">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-6 w-6 text-white/40 rotate-90" />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-transparent to-deep-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-4">
              {t('howItWorks.title')}
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Join Beauty 2026 in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="card-glow p-6 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-royal-gold-500 rounded-full 
                                flex items-center justify-center text-deep-purple-900 font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 bg-royal-gold-500/10 rounded-xl flex items-center justify-center mb-4">
                    <step.icon className="h-7 w-7 text-royal-gold-400" />
                  </div>

                  <h3 className="font-display text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {step.desc}
                  </p>
                </div>

                {/* Connector Line */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-royal-gold-500/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Contestants */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
                {votingEnabled ? 'Top Contestants' : 'Our Contestants'}
              </h2>
              <p className="text-white/60">
                {votingEnabled ? 'Leading the leaderboard right now' : 'Meet our amazing contestants'}
              </p>
            </div>
            <Link 
              href="/contestants" 
              className="hidden md:flex items-center space-x-2 text-royal-gold-400 hover:text-royal-gold-300 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingContestants ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-royal-gold-400 mx-auto mb-4"></div>
              <p className="text-white/60">Loading contestants...</p>
            </div>
          ) : featuredContestants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredContestants.map((contestant, index) => (
                <ContestantCard 
                  key={contestant.id} 
                  contestant={contestant} 
                  rank={index + 1}
                  showRank={votingEnabled}
                  votingEnabled={votingEnabled}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4">No contestants yet. Be the first to register!</p>
              <Link href="/register" className="btn-primary">
                Register Now
              </Link>
            </div>
          )}

          <div className="md:hidden text-center mt-8">
            <Link href="/contestants" className="btn-secondary">
              View All Contestants
            </Link>
          </div>
        </div>
      </section>

      {/* Districts Map Section */}
      <section className="py-20 bg-gradient-to-b from-deep-purple-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-4">
              Compete From Your District
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Beauty 2026 covers all 25 districts across 9 provinces of Sri Lanka
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {provinces.slice(0, 6).map((province) => (
              <div key={province.id} className="card-glow p-6">
                <h3 className="font-display text-lg font-semibold text-royal-gold-400 mb-3">
                  {province.name[language]}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {province.districts.map((districtId) => {
                    const district = districts.find(d => d.id === districtId);
                    return (
                      <span 
                        key={districtId}
                        className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/70"
                      >
                        {district?.name[language]}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/about" className="btn-secondary">
              See All Districts & Rules
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-glow p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-royal-gold-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-hot-pink-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <Crown className="h-16 w-16 text-royal-gold-400 mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Become Beauty 2026?
              </h2>
              <p className="text-white/60 mb-8 max-w-xl mx-auto">
                Download Tuko, create your profile, and start your journey to becoming 
                Sri Lanka's next beauty queen!
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {isAuthenticated ? (
                  <Link href="/register" className="btn-primary text-lg px-10 py-4">
                    Register Now
                  </Link>
                ) : (
                  <button onClick={() => login()} className="btn-primary text-lg px-10 py-4">
                    Login with Tuko to Start
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
