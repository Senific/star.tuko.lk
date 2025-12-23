'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  ArrowLeft, Calendar, Clock, Edit, Trash2, Plus, Check, X,
  Trophy, Users, Vote, Crown, Star, PlayCircle, Save
} from 'lucide-react';

// Competition phases
const competitionPhases = [
  {
    id: 'registration',
    name: 'Registration',
    description: 'Contestants can register and submit applications',
    startDate: '2026-03-20',
    endDate: '2026-04-20',
    status: 'active',
    icon: Users,
  },
  {
    id: 'district_round',
    name: 'District Round',
    description: 'Voting for district winners - Top 5 from each district advance',
    startDate: '2026-04-25',
    endDate: '2026-05-15',
    status: 'upcoming',
    icon: Vote,
  },
  {
    id: 'province_round',
    name: 'Province Round',
    description: 'Voting for province winners - Top 3 from each province advance',
    startDate: '2026-05-20',
    endDate: '2026-06-10',
    status: 'upcoming',
    icon: Crown,
  },
  {
    id: 'national_semifinal',
    name: 'National Semi-Final',
    description: 'Top 27 contestants compete - Final 10 selected',
    startDate: '2026-06-15',
    endDate: '2026-06-25',
    status: 'upcoming',
    icon: Star,
  },
  {
    id: 'national_finale',
    name: 'National Finale',
    description: 'Live YouTube finale - Winner crowned',
    startDate: '2026-07-06',
    endDate: '2026-07-06',
    status: 'upcoming',
    icon: Trophy,
  },
];

const importantDates = [
  { date: '2026-03-20', event: 'Registration Opens', type: 'milestone' },
  { date: '2026-04-15', event: 'Early Bird Registration Deadline', type: 'deadline' },
  { date: '2026-04-20', event: 'Registration Closes', type: 'deadline' },
  { date: '2026-04-25', event: 'District Round Begins', type: 'milestone' },
  { date: '2026-05-15', event: 'District Winners Announced', type: 'results' },
  { date: '2026-05-20', event: 'Province Round Begins', type: 'milestone' },
  { date: '2026-06-10', event: 'Province Winners Announced', type: 'results' },
  { date: '2026-06-15', event: 'National Semi-Final Begins', type: 'milestone' },
  { date: '2026-06-25', event: 'Final 10 Announced', type: 'results' },
  { date: '2026-07-06', event: 'National Finale - Live on YouTube', type: 'finale' },
];

export default function SchedulePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [phases, setPhases] = useState(competitionPhases);
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [editData, setEditData] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-royal-gold-400"></div>
      </div>
    );
  }

  const handleEditPhase = (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    if (phase) {
      setEditData({ startDate: phase.startDate, endDate: phase.endDate });
      setEditingPhase(phaseId);
    }
  };

  const handleSavePhase = (phaseId: string) => {
    setPhases(prev => prev.map(p => 
      p.id === phaseId 
        ? { ...p, startDate: editData.startDate, endDate: editData.endDate }
        : p
    ));
    setEditingPhase(null);
  };

  const statusColors = {
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    active: 'bg-royal-gold-500/20 text-royal-gold-400 border-royal-gold-500/30',
    upcoming: 'bg-white/10 text-white/60 border-white/20',
  };

  const eventTypeColors = {
    milestone: 'bg-blue-500',
    deadline: 'bg-red-500',
    results: 'bg-green-500',
    finale: 'bg-royal-gold-500',
  };

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/dashboard" className="text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Competition Schedule</h1>
          <p className="text-white/60">Manage competition phases and important dates</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Competition Phases */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Competition Phases</h2>
          </div>

          {phases.map((phase, index) => {
            const PhaseIcon = phase.icon;
            const isEditing = editingPhase === phase.id;
            
            return (
              <div key={phase.id} className="card-glow p-6 relative">
                {/* Phase Number */}
                <div className="absolute -left-3 top-6 h-8 w-8 rounded-full bg-gradient-to-br from-royal-gold-400 
                              to-hot-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>

                <div className="ml-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <PhaseIcon className={`h-6 w-6 ${
                        phase.status === 'active' ? 'text-royal-gold-400' : 
                        phase.status === 'completed' ? 'text-green-400' : 'text-white/40'
                      }`} />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{phase.name}</h3>
                        <p className="text-white/60 text-sm">{phase.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                      border ${statusColors[phase.status as keyof typeof statusColors]}`}>
                        {phase.status === 'active' && <PlayCircle className="h-3 w-3 mr-1" />}
                        {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                      </span>
                      {!isEditing && (
                        <button 
                          onClick={() => handleEditPhase(phase.id)}
                          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Date Display/Edit */}
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                    <Calendar className="h-5 w-5 text-white/40" />
                    {isEditing ? (
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-1">
                          <label className="text-white/40 text-xs">Start Date</label>
                          <input
                            type="date"
                            value={editData.startDate}
                            onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white 
                                     focus:outline-none focus:border-royal-gold-500/50"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-white/40 text-xs">End Date</label>
                          <input
                            type="date"
                            value={editData.endDate}
                            onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white 
                                     focus:outline-none focus:border-royal-gold-500/50"
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-4">
                          <button 
                            onClick={() => handleSavePhase(phase.id)}
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setEditingPhase(null)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className="text-white">
                          {phase.startDate === phase.endDate 
                            ? phase.startDate 
                            : `${phase.startDate} — ${phase.endDate}`
                          }
                        </p>
                        <p className="text-white/40 text-sm">
                          {phase.startDate === phase.endDate 
                            ? 'Single Day Event'
                            : `${Math.ceil((new Date(phase.endDate).getTime() - new Date(phase.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < phases.length - 1 && (
                  <div className="absolute left-1 top-14 bottom-0 w-px bg-gradient-to-b from-royal-gold-500/50 to-transparent h-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Important Dates Sidebar */}
        <div className="space-y-6">
          <div className="card-glow p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-royal-gold-400" />
              Important Dates
            </h2>

            <div className="space-y-4">
              {importantDates.map((item, index) => {
                const isPast = item.date < currentDate;
                const isToday = item.date === currentDate;
                
                return (
                  <div 
                    key={index}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      isToday 
                        ? 'bg-royal-gold-500/20 border border-royal-gold-500/30'
                        : isPast 
                        ? 'opacity-50'
                        : 'bg-white/5'
                    }`}
                  >
                    <div className={`h-3 w-3 rounded-full mt-1.5 ${eventTypeColors[item.type as keyof typeof eventTypeColors]}`} />
                    <div>
                      <p className="text-white font-medium text-sm">{item.event}</p>
                      <p className={`text-sm ${isToday ? 'text-royal-gold-400' : 'text-white/40'}`}>
                        {item.date}
                        {isToday && ' (Today)'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-white/40 text-xs mb-2">Legend</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-white/60">Milestone</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-white/60">Deadline</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-white/60">Results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-royal-gold-500" />
                  <span className="text-white/60">Finale</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-glow p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 
                               transition-colors text-left">
                <PlayCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white text-sm font-medium">Start Next Phase</p>
                  <p className="text-white/40 text-xs">District Round</p>
                </div>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 
                               transition-colors text-left">
                <Trophy className="h-5 w-5 text-royal-gold-400" />
                <div>
                  <p className="text-white text-sm font-medium">Announce Winners</p>
                  <p className="text-white/40 text-xs">District results pending</p>
                </div>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 
                               transition-colors text-left">
                <Calendar className="h-5 w-5 text-hot-pink-400" />
                <div>
                  <p className="text-white text-sm font-medium">Add Custom Event</p>
                  <p className="text-white/40 text-xs">Create new milestone</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
