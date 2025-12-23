'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, MapPin, Youtube, Bell, CheckCircle } from 'lucide-react';

export default function SchedulePage() {
  const { language, t } = useLanguage();

  const phases = [
    {
      id: 'registration',
      title: 'Registration Phase',
      status: 'upcoming',
      dates: 'March 20 - April 20, 2026',
      events: [
        { date: 'Mar 20', title: 'Registration Opens', time: '00:00 IST', desc: 'Online applications begin' },
        { date: 'Apr 15', title: 'Early Bird Deadline', time: '23:59 IST', desc: 'Last day for early registration' },
        { date: 'Apr 20', title: 'Registration Closes', time: '23:59 IST', desc: 'Final deadline for all applications' },
      ],
    },
    {
      id: 'district',
      title: 'District Round',
      status: 'upcoming',
      dates: 'April 21 - May 21, 2026',
      events: [
        { date: 'Apr 21', title: 'Voting Begins', time: '00:00 IST', desc: 'Public voting opens for all contestants' },
        { date: 'May 14', title: 'Final Week', time: '-', desc: 'Last chance to vote for district round' },
        { date: 'May 21', title: 'Voting Ends', time: '23:59 IST', desc: 'District round voting closes' },
        { date: 'May 22', title: 'Results Announced', time: '18:00 IST', desc: '25 District Queens revealed' },
      ],
    },
    {
      id: 'province',
      title: 'Province Round',
      status: 'upcoming',
      dates: 'May 25 - June 15, 2026',
      events: [
        { date: 'May 25', title: 'Province Voting Begins', time: '00:00 IST', desc: 'District winners compete' },
        { date: 'Jun 10', title: 'Judge Evaluation', time: '-', desc: 'Panel reviews profiles & videos' },
        { date: 'Jun 15', title: 'Voting Ends', time: '23:59 IST', desc: 'Province round voting closes' },
        { date: 'Jun 16', title: 'Results Announced', time: '18:00 IST', desc: '9 Province Queens revealed' },
      ],
    },
    {
      id: 'national',
      title: 'National Finale',
      status: 'upcoming',
      dates: 'June 20 - July 6, 2026',
      events: [
        { date: 'Jun 20', title: 'Finale Voting Begins', time: '00:00 IST', desc: 'Vote for Beauty 2026 Queen' },
        { date: 'Jun 28', title: 'Judge Panel Review', time: '-', desc: 'Final evaluations' },
        { date: 'Jul 5', title: 'Voting Ends', time: '23:59 IST', desc: 'Final chance to vote' },
        { date: 'Jul 6', title: '👑 GRAND FINALE', time: '19:00 IST', desc: 'YouTube Live - Queen Crowned!', highlight: true },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'active': return 'bg-royal-gold-500/20 text-royal-gold-400 border-royal-gold-500/30';
      case 'upcoming': return 'bg-white/10 text-white/60 border-white/20';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Calendar className="h-16 w-16 text-royal-gold-400 mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
            {t('nav.schedule')}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Complete timeline of Beauty 2026 events and deadlines
          </p>
        </div>

        {/* Reminder Card */}
        <div className="glass-card p-6 mb-10 flex items-center space-x-4">
          <div className="bg-royal-gold-500/20 p-3 rounded-full">
            <Bell className="h-6 w-6 text-royal-gold-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">Don't Miss Any Updates!</h3>
            <p className="text-white/60 text-sm">
              Follow us on Tuko to get notifications about all events and deadlines.
            </p>
          </div>
          <button className="btn-primary text-sm py-2 px-4 hidden md:block">
            Follow on Tuko
          </button>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {phases.map((phase, phaseIndex) => (
            <div key={phase.id} className="card-glow overflow-hidden">
              {/* Phase Header */}
              <div className="bg-gradient-to-r from-deep-purple-800 to-deep-purple-900 p-5 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">
                      {phase.title}
                    </h2>
                    <p className="text-white/60 text-sm mt-1">{phase.dates}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(phase.status)}`}>
                    {phase.status === 'completed' ? 'Completed' : 
                     phase.status === 'active' ? 'In Progress' : 'Upcoming'}
                  </span>
                </div>
              </div>

              {/* Events */}
              <div className="p-5">
                <div className="space-y-4">
                  {phase.events.map((event, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start space-x-4 p-4 rounded-xl transition-colors ${
                        event.highlight 
                          ? 'bg-gradient-to-r from-royal-gold-500/20 to-hot-pink-500/20 border border-royal-gold-500/30' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {/* Date */}
                      <div className="min-w-[60px] text-center">
                        <div className={`text-lg font-bold ${event.highlight ? 'text-royal-gold-400' : 'text-white'}`}>
                          {event.date.split(' ')[0]}
                        </div>
                        <div className="text-xs text-white/40">
                          {event.date.split(' ')[1]}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="w-px h-full bg-white/10" />

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className={`font-semibold ${event.highlight ? 'text-royal-gold-400 text-lg' : 'text-white'}`}>
                          {event.title}
                        </h3>
                        <p className="text-white/60 text-sm mt-1">{event.desc}</p>
                        {event.time !== '-' && (
                          <div className="flex items-center space-x-1 mt-2 text-white/40 text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>

                      {/* YouTube indicator for finale */}
                      {event.highlight && (
                        <div className="flex items-center space-x-2 text-red-500">
                          <Youtube className="h-6 w-6" />
                          <span className="text-xs font-medium">LIVE</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grand Finale Banner */}
        <div className="mt-12 card-glow p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-royal-gold-500/10 via-hot-pink-500/10 to-royal-gold-500/10" />
          
          <div className="relative z-10">
            <Youtube className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
              Grand Finale Live Stream
            </h2>
            <p className="text-white/60 mb-4">
              July 6, 2026 at 7:00 PM IST
            </p>
            <p className="text-royal-gold-400 text-lg font-semibold mb-6">
              Watch the crowning of Beauty 2026 Queen on YouTube!
            </p>
            <button className="btn-primary">
              Set Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
