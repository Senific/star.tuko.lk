'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Trophy, Crown, Medal, Heart, MapPin, ArrowUp, ArrowDown, Minus, HelpCircle, Lock } from 'lucide-react';
import { districts, provinces } from '@/data/locations';

type ViewType = 'overall' | 'district' | 'province';

interface Contestant {
  id: string;
  fullName: string;
  profilePhoto: string | null;
  districtId: string;
  provinceId: string;
  votes: number;
}

export default function LeaderboardPage() {
  const { language, t } = useLanguage();
  const [viewType, setViewType] = useState<ViewType>('overall');
  const [selectedProvince, setSelectedProvince] = useState(provinces[0].id);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);
  const [resultsReleased, setResultsReleased] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status and results status, then fetch contestants
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check admin status first
        let adminStatus = false;
        try {
          const adminResponse = await fetch('/api/auth/tuko/session', { credentials: 'include' });
          if (adminResponse.ok) {
            const adminData = await adminResponse.json();
            // Check if user is admin based on phone number
            const ADMIN_PHONES = ['764092662', '769770981'];
            const userPhone = adminData.user?.phone?.replace(/\D/g, '');
            const normalizedPhone = userPhone?.startsWith('94') ? userPhone.slice(2) : (userPhone?.startsWith('0') ? userPhone.slice(1) : userPhone);
            adminStatus = ADMIN_PHONES.includes(normalizedPhone || '');
            setIsAdmin(adminStatus);
          }
        } catch {
          // Not logged in or error - not admin
        }

        // Check if results are released (for non-admin users)
        const statusResponse = await fetch('/api/settings/results-status');
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setResultsReleased(statusData.resultsReleased);
        }
        
        // Fetch contestants if admin OR results are released
        if (adminStatus || resultsReleased) {
          const response = await fetch('/api/contestants?withVotes=true');
          if (response.ok) {
            const data = await response.json();
            setContestants(data.contestants || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refetch contestants when resultsReleased changes (in case it was set after initial load)
  useEffect(() => {
    const fetchContestants = async () => {
      if ((isAdmin || resultsReleased) && contestants.length === 0) {
        try {
          const response = await fetch('/api/contestants?withVotes=true');
          if (response.ok) {
            const data = await response.json();
            setContestants(data.contestants || []);
          }
        } catch (error) {
          console.error('Failed to fetch contestants:', error);
        }
      }
    };
    fetchContestants();
  }, [isAdmin, resultsReleased]);

  // Determine if leaderboard should be shown
  const showLeaderboard = isAdmin || resultsReleased;

  // Sort contestants by votes
  const rankedContestants = useMemo(() => {
    return [...contestants].sort((a, b) => b.votes - a.votes);
  }, [contestants]);

  // Group by district
  const districtLeaders = useMemo(() => {
    const grouped: { [key: string]: Contestant[] } = {};
    
    rankedContestants.forEach(c => {
      if (!grouped[c.districtId]) {
        grouped[c.districtId] = [];
      }
      grouped[c.districtId].push(c);
    });

    return Object.entries(grouped).map(([districtId, contestants]) => ({
      districtId,
      district: districts.find(d => d.id === districtId),
      leader: contestants[0],
      totalContestants: contestants.length,
      totalVotes: contestants.reduce((sum, c) => sum + c.votes, 0),
    })).sort((a, b) => b.leader.votes - a.leader.votes);
  }, [rankedContestants]);

  // Group by province
  const provinceLeaders = useMemo(() => {
    const grouped: { [key: string]: Contestant[] } = {};
    
    rankedContestants.forEach(c => {
      if (!grouped[c.provinceId]) {
        grouped[c.provinceId] = [];
      }
      grouped[c.provinceId].push(c);
    });

    return Object.entries(grouped).map(([provinceId, contestants]) => ({
      provinceId,
      province: provinces.find(p => p.id === provinceId),
      leader: contestants[0],
      totalContestants: contestants.length,
      totalVotes: contestants.reduce((sum, c) => sum + c.votes, 0),
    })).sort((a, b) => b.leader.votes - a.leader.votes);
  }, [rankedContestants]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2: return <Medal className="h-6 w-6 text-gray-300" />;
      case 3: return <Medal className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-white/60 font-semibold">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30';
      case 3: return 'bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30';
      default: return 'bg-white/5 border-white/10';
    }
  };

  // Mystery placeholder component for non-admin users
  const MysteryPlaceholder = ({ rank }: { rank: number }) => {
    const colors = {
      1: { bg: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/30', badge: 'bg-yellow-500', icon: '👑' },
      2: { bg: 'from-gray-400/20 to-gray-500/10', border: 'border-gray-400/30', badge: 'bg-gray-400', icon: '🥈' },
      3: { bg: 'from-amber-600/20 to-amber-700/10', border: 'border-amber-600/30', badge: 'bg-amber-600', icon: '🥉' },
    }[rank] || { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', badge: 'bg-purple-500', icon: '?' };

    return (
      <div 
        className={`card-glow p-6 text-center bg-gradient-to-br ${colors.bg} ${colors.border} ${rank === 1 ? 'md:order-2 md:-mt-4' : ''} ${rank === 2 ? 'md:order-1' : ''} ${rank === 3 ? 'md:order-3' : ''}`}
      >
        <div className="relative inline-block mb-4">
          {/* Mystery Circle with Question Mark */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-600/40 to-deep-purple-800/60 border-4 border-royal-gold-500/30 flex items-center justify-center animate-pulse">
            <HelpCircle className="w-12 h-12 md:w-16 md:h-16 text-royal-gold-400/80" />
          </div>
          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full ${colors.badge}`}>
            <span className="text-deep-purple-900 font-bold text-sm">
              {colors.icon} #{rank}
            </span>
          </div>
        </div>
        
        <h3 className="font-display text-lg font-semibold text-white/60 mb-1">
          ? ? ?
        </h3>
        <p className="text-white/40 text-sm flex items-center justify-center space-x-1 mb-3">
          <MapPin className="h-3 w-3" />
          <span>Unknown Location</span>
        </p>
        <div className="flex items-center justify-center space-x-2 text-hot-pink-400/50">
          <Heart className="h-5 w-5" />
          <span className="font-bold text-xl">???</span>
        </div>
        
        <div className="mt-4 text-white/40 text-sm italic">
          Coming Soon...
        </div>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="pt-20 lg:pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-gold-500 mx-auto mb-4"></div>
          <p className="text-white/60">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <Trophy className="h-16 w-16 text-royal-gold-400 mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
            {t('nav.leaderboard')}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            {showLeaderboard ? 'Real-time rankings of Beauty 2026 contestants' : 'Stay tuned to see who leads the Beauty 2026 competition!'}
          </p>
          {isAdmin && !resultsReleased && (
            <p className="text-royal-gold-400 text-sm mt-2">
              👑 Admin View - Results not yet released to public
            </p>
          )}
        </div>

        {/* Results Not Released (and not admin) - Mystery Placeholders */}
        {!showLeaderboard && (
          <>
            {/* Mystery Top 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <MysteryPlaceholder rank={1} />
              <MysteryPlaceholder rank={2} />
              <MysteryPlaceholder rank={3} />
            </div>

            {/* Message for non-admin users */}
            <div className="card-glow p-8 text-center">
              <Lock className="h-12 w-12 text-royal-gold-400/60 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-semibold text-white mb-3">
                Leaderboard Coming Soon!
              </h2>
              <p className="text-white/60 max-w-lg mx-auto mb-6">
                The full leaderboard will be revealed once results are released. Until then, keep guessing who will take the crown!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/contestants" 
                  className="btn-primary px-6 py-3"
                >
                  View All Contestants
                </Link>
                <Link 
                  href="/schedule" 
                  className="btn-secondary px-6 py-3"
                >
                  Check Schedule
                </Link>
              </div>
            </div>

            {/* Teaser stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-royal-gold-400">?</p>
                <p className="text-white/40 text-sm">Total Contestants</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-hot-pink-400">?</p>
                <p className="text-white/40 text-sm">Total Votes</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-purple-400">?</p>
                <p className="text-white/40 text-sm">Districts</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-cyan-400">?</p>
                <p className="text-white/40 text-sm">Provinces</p>
              </div>
            </div>
          </>
        )}

        {/* Full Leaderboard - For admins OR when results released */}
        {showLeaderboard && (
          <>
            {/* View Toggle */}
            <div className="flex justify-center mb-8">
              <div className="glass-card inline-flex p-1">
                {[
                  { id: 'overall', label: 'Overall' },
                  { id: 'district', label: 'By District' },
                  { id: 'province', label: 'By Province' },
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => setViewType(view.id as ViewType)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                      viewType === view.id
                        ? 'bg-royal-gold-500 text-deep-purple-900'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            </div>

            {/* No Data Message */}
            {rankedContestants.length === 0 && (
              <div className="card-glow p-8 text-center">
                <Trophy className="h-12 w-12 text-royal-gold-400/40 mx-auto mb-4" />
                <h2 className="font-display text-xl font-semibold text-white mb-2">No Contestants Yet</h2>
                <p className="text-white/60">Approved contestants will appear here once they start receiving votes.</p>
              </div>
            )}

            {/* Overall Leaderboard */}
            {viewType === 'overall' && rankedContestants.length > 0 && (
              <div className="space-y-3">
                {/* Top 3 Special Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {rankedContestants.slice(0, 3).map((contestant, index) => {
                    const district = districts.find(d => d.id === contestant.districtId);
                    const rank = index + 1;
                    
                    return (
                      <div 
                        key={contestant.id}
                        className={`card-glow p-6 text-center ${rank === 1 ? 'md:order-2 md:-mt-4' : ''} ${rank === 2 ? 'md:order-1' : ''} ${rank === 3 ? 'md:order-3' : ''}`}
                      >
                        <div className="relative inline-block mb-4">
                          <img
                            src={contestant.profilePhoto || '/images/default-avatar.jpg'}
                            alt={contestant.fullName}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-royal-gold-500/30"
                          />
                          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full ${
                            rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-600'
                          }`}>
                            <span className="text-deep-purple-900 font-bold text-sm">
                              {rank === 1 ? '👑' : rank === 2 ? '🥈' : '🥉'} #{rank}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="font-display text-lg font-semibold text-white mb-1">
                          {contestant.fullName}
                        </h3>
                        <p className="text-white/50 text-sm flex items-center justify-center space-x-1 mb-3">
                          <MapPin className="h-3 w-3" />
                          <span>{district?.name[language]}</span>
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-hot-pink-400">
                          <Heart className="h-5 w-5" fill="currentColor" />
                          <span className="font-bold text-xl">{contestant.votes.toLocaleString()}</span>
                        </div>
                        
                        <Link 
                          href={`/contestant/${contestant.id}`}
                          className="inline-block mt-4 text-royal-gold-400 text-sm hover:underline"
                        >
                          View Profile →
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* Rest of the list */}
                {rankedContestants.slice(3).map((contestant, index) => {
                  const rank = index + 4;
                  const district = districts.find(d => d.id === contestant.districtId);
                  
                  return (
                    <div
                      key={contestant.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${getRankBg(rank)} 
                                hover:border-royal-gold-500/30 transition-colors`}
                    >
                      <div className="w-10 text-center">
                        {getRankIcon(rank)}
                      </div>
                      
                      <img
                        src={contestant.profilePhoto || '/images/default-avatar.jpg'}
                        alt={contestant.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {contestant.fullName}
                        </h3>
                        <p className="text-white/50 text-sm flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{district?.name[language]}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-hot-pink-400">
                          <Heart className="h-4 w-4" fill="currentColor" />
                          <span className="font-bold">{contestant.votes.toLocaleString()}</span>
                        </div>
                      </div>

                      <Link
                        href={`/contestant/${contestant.id}`}
                        className="text-royal-gold-400 hover:text-royal-gold-300 text-sm"
                      >
                        View →
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* District Leaderboard */}
            {viewType === 'district' && districtLeaders.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {districtLeaders.map((item, index) => (
                  <div key={item.districtId} className="card-glow p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[40px]">
                        {getRankIcon(index + 1)}
                      </div>
                      
                      <img
                        src={item.leader.profilePhoto || '/images/default-avatar.jpg'}
                        alt={item.leader.fullName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-royal-gold-500/30"
                      />
                      
                      <div className="flex-1">
                        <p className="text-royal-gold-400 text-sm font-medium">
                          {item.district?.name[language]}
                        </p>
                        <h3 className="font-semibold text-white">
                          {item.leader.fullName}
                        </h3>
                        <p className="text-white/40 text-xs">
                          {item.totalContestants} contestants • {item.totalVotes.toLocaleString()} total votes
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-hot-pink-400">
                          <Heart className="h-4 w-4" fill="currentColor" />
                          <span className="font-bold">{item.leader.votes.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Province Leaderboard */}
            {viewType === 'province' && provinceLeaders.length > 0 && (
              <div className="space-y-4">
                {provinceLeaders.map((item, index) => (
                  <div key={item.provinceId} className={`card-glow p-6 border ${getRankBg(index + 1)}`}>
                    <div className="flex items-center gap-6">
                      <div className="text-center min-w-[50px]">
                        {getRankIcon(index + 1)}
                      </div>
                      
                      <div className="relative">
                        <img
                          src={item.leader.profilePhoto || '/images/default-avatar.jpg'}
                          alt={item.leader.fullName}
                          className="w-20 h-20 rounded-full object-cover border-4 border-royal-gold-500/30"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-royal-gold-500 rounded-full p-1">
                          <Crown className="h-4 w-4 text-deep-purple-900" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h2 className="font-display text-xl font-semibold text-royal-gold-400">
                          {item.province?.name[language]}
                        </h2>
                        <p className="text-white font-medium mt-1">
                          Leading: {item.leader.fullName}
                        </p>
                        <p className="text-white/40 text-sm mt-1">
                          {item.totalContestants} contestants • {item.totalVotes.toLocaleString()} total votes
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-white/40 text-xs mb-1">Leader's Votes</p>
                        <div className="flex items-center justify-end space-x-1 text-hot-pink-400">
                          <Heart className="h-5 w-5" fill="currentColor" />
                          <span className="font-bold text-2xl">{item.leader.votes.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
