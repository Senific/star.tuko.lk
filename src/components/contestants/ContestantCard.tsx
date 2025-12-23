'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Heart, Eye, MapPin, Trophy, Share2, Check } from 'lucide-react';
import { districts } from '@/data/locations';

// Flexible contestant type that works with both mock and API data
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

interface ContestantCardProps {
  contestant: ContestantData;
  rank?: number;
  showRank?: boolean;
  votingEnabled?: boolean;
}

export default function ContestantCard({ contestant, rank, showRank = false, votingEnabled = false }: ContestantCardProps) {
  const { user, isAuthenticated, login } = useAuth();
  const { language, t } = useLanguage();
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(contestant.votes);
  const [isVoting, setIsVoting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Get district name - either from API or from local data
  const district = contestant.district 
    ? { name: { en: contestant.district, si: contestant.district, ta: contestant.district } }
    : districts.find(d => d.id === contestant.districtId);

  const handleVote = async () => {
    if (!isAuthenticated) {
      login();
      return;
    }

    if (hasVoted || !user) return;

    setIsVoting(true);
    
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contestantId: contestant.id }),
      });
      
      if (response.ok) {
        setHasVoted(true);
        setVoteCount(prev => prev + 1);
      } else {
        const data = await response.json();
        if (data.alreadyVoted) {
          setHasVoted(true);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
    
    setIsVoting(false);
  };

  const handleShare = () => {
    const url = `https://star.tuko.lk/contestant/${contestant.id}`;
    const text = `Vote for ${contestant.name} in Beauty 2026! 👑`;
    
    if (navigator.share) {
      navigator.share({ title: 'Beauty 2026', text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Link copied to clipboard!');
    }
  };

  const getRankBadge = () => {
    if (!rank || !showRank) return null;
    
    const badges: { [key: number]: { bg: string; text: string; icon: string } } = {
      1: { bg: 'bg-gradient-to-r from-yellow-400 to-yellow-600', text: 'text-yellow-900', icon: '👑' },
      2: { bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: 'text-gray-800', icon: '🥈' },
      3: { bg: 'bg-gradient-to-r from-amber-600 to-amber-700', text: 'text-amber-100', icon: '🥉' },
    };

    const badge = badges[rank];
    
    if (badge) {
      return (
        <div className={`absolute top-3 left-3 ${badge.bg} ${badge.text} 
                        px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 z-10`}>
          <span>{badge.icon}</span>
          <span>#{rank}</span>
        </div>
      );
    }

    return (
      <div className="absolute top-3 left-3 bg-deep-purple-700/80 text-white 
                      px-3 py-1 rounded-full text-sm font-semibold z-10">
        #{rank}
      </div>
    );
  };

  return (
    <div className="card-glow group">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
        <img
          src={contestant.profilePhoto}
          alt={contestant.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-purple-900 via-transparent to-transparent" />
        
        {/* Rank Badge */}
        {getRankBadge()}

        {/* Vote Count Overlay - only show when voting is enabled */}
        {votingEnabled && (
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm 
                         px-3 py-1.5 rounded-full flex items-center space-x-1.5">
            <Heart className="h-4 w-4 text-hot-pink-400" fill="currentColor" />
            <span className="text-white text-sm font-semibold">
              {voteCount.toLocaleString()}
            </span>
          </div>
        )}

        {/* District Badge */}
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm 
                       px-3 py-1.5 rounded-full flex items-center space-x-1.5">
          <MapPin className="h-3.5 w-3.5 text-royal-gold-400" />
          <span className="text-white text-xs">
            {district?.name?.[language] || district?.name?.en || contestant.district || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name & Age */}
        <div className="mb-3">
          <h3 className="font-display text-lg font-semibold text-white group-hover:text-royal-gold-400 transition-colors">
            {contestant.name}
          </h3>
          <p className="text-white/50 text-sm">{contestant.age} years</p>
        </div>

        {/* Talents */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {contestant.talents.slice(0, 2).map((talent, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-royal-gold-500/10 text-royal-gold-400 
                       rounded-full text-xs"
            >
              {talent}
            </span>
          ))}
          {contestant.talents.length > 2 && (
            <span className="px-2 py-0.5 bg-white/5 text-white/40 rounded-full text-xs">
              +{contestant.talents.length - 2}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Vote Button - only show when voting is enabled */}
          {votingEnabled && (
            <button
              onClick={handleVote}
              disabled={hasVoted || isVoting}
              className={`flex-1 py-2.5 rounded-full font-semibold text-sm flex items-center justify-center space-x-2 transition-all
                ${hasVoted 
                  ? 'bg-green-500/20 text-green-400 cursor-default'
                  : isVoting
                    ? 'bg-hot-pink-500/50 text-white cursor-wait'
                    : 'btn-vote'
                }`}
            >
              {hasVoted ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>{t('contestant.voted')}</span>
                </>
              ) : isVoting ? (
                <span>Voting...</span>
              ) : (
                <>
                  <Heart className="h-4 w-4" />
                  <span>{isAuthenticated ? t('contestant.vote') : t('contestant.login_to_vote')}</span>
                </>
              )}
            </button>
          )}

          {/* View Profile */}
          <Link
            href={`/contestant/${contestant.id}`}
            className={`${votingEnabled ? '' : 'flex-1'} p-2.5 bg-white/5 rounded-full text-white/60 hover:text-royal-gold-400 
                     hover:bg-white/10 transition-colors flex items-center justify-center gap-2`}
            title={t('contestant.view_profile')}
          >
            <Eye className="h-5 w-5" />
            {!votingEnabled && <span className="text-sm">View Profile</span>}
          </Link>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2.5 bg-white/5 rounded-full text-white/60 hover:text-royal-gold-400 
                     hover:bg-white/10 transition-colors"
            title={t('general.share')}
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
