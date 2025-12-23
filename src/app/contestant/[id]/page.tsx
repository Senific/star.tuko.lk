'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Heart, MapPin, Calendar, Ruler, Star, Share2, 
  ArrowLeft, Check, Trophy, Crown, Play, X,
  Facebook, Twitter, Instagram, Link as LinkIcon, Copy, Loader2
} from 'lucide-react';

// Contestant type for the page
interface ContestantData {
  id: string;
  contestantNo: string | null;
  name: string;
  firstName: string;
  lastName: string;
  age: number;
  height: string | null;
  bio: string;
  profilePhoto: string;
  photos: string[];
  video: string | null;
  districtId: string;
  district: string;
  districtName: { en: string; si: string; ta: string };
  provinceId: string;
  province: string;
  provinceName: { en: string; si: string; ta: string };
  votes: number;
  rank: number;
  talents: string[];
  status: string;
  currentRound: string;
  districtRank: number | null;
  provinceRank: number | null;
  createdAt: string;
}

export default function ContestantProfilePage() {
  const params = useParams();
  const { user, isAuthenticated, login } = useAuth();
  const { language } = useLanguage();
  
  const [contestant, setContestant] = useState<ContestantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [votingEnabled, setVotingEnabled] = useState(false);

  // Fetch voting status
  useEffect(() => {
    const fetchVotingStatus = async () => {
      try {
        const response = await fetch('/api/settings/voting-status');
        const data = await response.json();
        setVotingEnabled(data.votingEnabled);
      } catch (error) {
        console.error('Error fetching voting status:', error);
      }
    };
    fetchVotingStatus();
  }, []);

  useEffect(() => {
    const fetchContestant = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/contestants/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Contestant not found');
          } else {
            throw new Error('Failed to fetch contestant');
          }
          return;
        }
        const data = await response.json();
        setContestant(data.contestant);
        setVoteCount(data.contestant.votes);
      } catch (err) {
        console.error('Error fetching contestant:', err);
        setError('Failed to load contestant. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchContestant();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="pt-20 lg:pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-royal-gold-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading contestant...</p>
        </div>
      </div>
    );
  }

  if (error || !contestant) {
    return (
      <div className="pt-20 lg:pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">{error || 'Contestant not found'}</p>
          <Link href="/contestants" className="btn-secondary">
            View All Contestants
          </Link>
        </div>
      </div>
    );
  }

  const rank = contestant.rank;

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

  const shareUrl = `https://star.tuko.lk/contestant/${contestant.id}`;
  const shareText = `Vote for ${contestant.name} in Beauty 2026! 👑`;

  const handleShare = (platform: string) => {
    const urls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      instagram: shareUrl, // Instagram doesn't have direct share URL
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (platform === 'native' && navigator.share) {
      navigator.share({ title: 'Beauty 2026', text: shareText, url: shareUrl });
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const getRankBadge = () => {
    if (rank === 1) return { bg: 'bg-yellow-500', icon: '👑', text: '#1' };
    if (rank === 2) return { bg: 'bg-gray-400', icon: '🥈', text: '#2' };
    if (rank === 3) return { bg: 'bg-amber-600', icon: '🥉', text: '#3' };
    if (rank <= 10) return { bg: 'bg-royal-gold-500', icon: '⭐', text: `#${rank}` };
    return { bg: 'bg-deep-purple-600', icon: '', text: `#${rank}` };
  };

  const rankBadge = getRankBadge();

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/contestants"
          className="inline-flex items-center space-x-2 text-white/60 hover:text-royal-gold-400 
                   transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Contestants</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photos */}
          <div className="lg:col-span-1 space-y-4">
            {/* Main Photo */}
            <div className="relative">
              <img
                src={contestant.profilePhoto}
                alt={contestant.name}
                className="w-full aspect-[3/4] object-cover rounded-2xl cursor-pointer"
                onClick={() => setSelectedImage(contestant.profilePhoto)}
              />
              
              {/* Rank Badge - only show when voting is enabled */}
              {votingEnabled && (
                <div className={`absolute top-4 left-4 ${rankBadge.bg} px-3 py-1.5 rounded-full 
                              flex items-center space-x-1 text-deep-purple-900 font-bold`}>
                  {rankBadge.icon && <span>{rankBadge.icon}</span>}
                  <span>{rankBadge.text}</span>
                </div>
              )}

              {/* Vote Count Overlay - only show when voting is enabled */}
              {votingEnabled && (
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm 
                              px-4 py-2 rounded-full flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-hot-pink-400" fill="currentColor" />
                  <span className="text-white font-bold text-lg">
                    {voteCount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Additional Photos */}
            {contestant.photos.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {contestant.photos.slice(0, 3).map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${contestant.name} photo ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg cursor-pointer 
                             hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedImage(photo)}
                  />
                ))}
              </div>
            )}

            {/* Video (if available) */}
            {contestant.video && (
              <div className="relative">
                <div className="w-full aspect-video bg-deep-purple-800 rounded-xl flex items-center justify-center">
                  <button className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-colors">
                    <Play className="h-8 w-8 text-white" fill="currentColor" />
                  </button>
                </div>
                <p className="text-center text-white/50 text-sm mt-2">Introduction Video</p>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="card-glow p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                    {contestant.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-white/60">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{contestant.age} years</span>
                    </span>
                    {contestant.height && (
                      <span className="flex items-center space-x-1">
                        <Ruler className="h-4 w-4" />
                        <span>{contestant.height}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Share Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-3 bg-white/5 rounded-full text-white/60 hover:text-royal-gold-400 
                               hover:bg-white/10 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>

                    {showShareMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-deep-purple-800 border border-royal-gold-500/20 
                                    rounded-xl shadow-xl overflow-hidden z-20">
                        <button
                          onClick={() => handleShare('facebook')}
                          className="w-full px-4 py-3 text-left text-sm text-white/80 hover:bg-white/5 
                                   flex items-center space-x-3"
                        >
                          <Facebook className="h-4 w-4 text-blue-500" />
                          <span>Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-full px-4 py-3 text-left text-sm text-white/80 hover:bg-white/5 
                                   flex items-center space-x-3"
                        >
                          <Twitter className="h-4 w-4 text-sky-400" />
                          <span>Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare('copy')}
                          className="w-full px-4 py-3 text-left text-sm text-white/80 hover:bg-white/5 
                                   flex items-center space-x-3"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 text-green-400" />
                              <span className="text-green-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Vote Button - only show when voting is enabled */}
                  {votingEnabled && (
                    <button
                      onClick={handleVote}
                      disabled={hasVoted || isVoting}
                      className={`px-8 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all
                        ${hasVoted 
                          ? 'bg-green-500/20 text-green-400 cursor-default'
                          : isVoting
                            ? 'bg-hot-pink-500/50 text-white cursor-wait'
                            : 'btn-vote text-lg'
                        }`}
                    >
                      {hasVoted ? (
                        <>
                          <Check className="h-5 w-5" />
                          <span>Voted</span>
                        </>
                      ) : isVoting ? (
                        <span>Voting...</span>
                      ) : (
                        <>
                          <Heart className="h-5 w-5" />
                          <span>{isAuthenticated ? 'Vote' : 'Login to Vote'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card-glow p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-royal-gold-400" />
                <span>Location</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/50 text-xs mb-1">District</p>
                  <p className="text-white font-semibold">{contestant.districtName?.[language] || contestant.district}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/50 text-xs mb-1">Province</p>
                  <p className="text-white font-semibold">{contestant.provinceName?.[language] || contestant.province}</p>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="card-glow p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-4">
                About Me
              </h3>
              <p className="text-white/70 leading-relaxed">
                {contestant.bio}
              </p>
            </div>

            {/* Talents */}
            {contestant.talents.length > 0 && (
              <div className="card-glow p-6">
                <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-royal-gold-400" />
                  <span>Talents & Hobbies</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {contestant.talents.map((talent, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-royal-gold-500/10 text-royal-gold-400 
                               rounded-full text-sm font-medium"
                    >
                      {talent}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats - only show when voting is enabled */}
            {votingEnabled && (
              <div className="card-glow p-6">
                <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-royal-gold-400" />
                  <span>Competition Stats</span>
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <p className="text-2xl font-bold text-gradient">{rank}</p>
                    <p className="text-white/50 text-xs mt-1">Overall Rank</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <p className="text-2xl font-bold text-hot-pink-400">{voteCount.toLocaleString()}</p>
                    <p className="text-white/50 text-xs mt-1">Total Votes</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <p className="text-2xl font-bold text-royal-gold-400">
                      {rank <= 25 ? '✓' : '-'}
                    </p>
                    <p className="text-white/50 text-xs mt-1">District Top 25</p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="glass-card p-6 text-center">
              <p className="text-white/60 mb-4">
                Support {contestant.name.split(' ')[0]} by sharing her profile!
              </p>
              <button
                onClick={() => handleShare('native')}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white/60 hover:text-white p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
