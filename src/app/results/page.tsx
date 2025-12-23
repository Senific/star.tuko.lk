'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Trophy, Crown, Calendar, Award, Clock } from 'lucide-react';

export default function ResultsPage() {
  const { language, t } = useLanguage();

  // Results will be populated as rounds complete
  const rounds = [
    {
      id: 'district',
      title: 'District Round Results',
      subtitle: '25 District Queens',
      status: 'upcoming', // upcoming, active, completed
      date: 'May 22, 2026',
      winners: [], // Will be populated when available
    },
    {
      id: 'province',
      title: 'Province Round Results',
      subtitle: '9 Province Queens',
      status: 'upcoming',
      date: 'June 16, 2026',
      winners: [],
    },
    {
      id: 'national',
      title: 'National Finale Results',
      subtitle: 'Beauty 2026 Queen',
      status: 'upcoming',
      date: 'July 6, 2026',
      winners: [],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            Completed
          </span>
        );
      case 'active':
        return (
          <span className="px-3 py-1 bg-royal-gold-500/20 text-royal-gold-400 rounded-full text-xs font-medium animate-pulse">
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-white/10 text-white/50 rounded-full text-xs font-medium">
            Upcoming
          </span>
        );
    }
  };

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Trophy className="h-16 w-16 text-royal-gold-400 mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
            {t('nav.results')}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Track winners from each round of Beauty 2026
          </p>
        </div>

        {/* Results Cards */}
        <div className="space-y-6">
          {rounds.map((round) => (
            <div key={round.id} className="card-glow overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-deep-purple-800 to-deep-purple-900 p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {round.id === 'national' ? (
                      <Crown className="h-8 w-8 text-royal-gold-400" />
                    ) : (
                      <Award className="h-8 w-8 text-royal-gold-400" />
                    )}
                    <div>
                      <h2 className="font-display text-xl font-bold text-white">
                        {round.title}
                      </h2>
                      <p className="text-white/60 text-sm">{round.subtitle}</p>
                    </div>
                  </div>
                  {getStatusBadge(round.status)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {round.status === 'upcoming' ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40 mb-2">Results will be announced on</p>
                    <p className="text-royal-gold-400 font-semibold text-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      {round.date}
                    </p>
                  </div>
                ) : round.winners.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Winners will be displayed here */}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/40">Results coming soon...</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-12 glass-card p-6 text-center">
          <h3 className="font-display text-lg font-semibold text-white mb-2">
            How Winners Are Determined
          </h3>
          <p className="text-white/60 text-sm max-w-2xl mx-auto">
            <strong className="text-royal-gold-400">District Round:</strong> 100% public votes. 
            Top contestant from each district wins.
            <br /><br />
            <strong className="text-royal-gold-400">Province & National Rounds:</strong> 50% public votes + 50% judge panel scores.
          </p>
        </div>
      </div>
    </div>
  );
}
