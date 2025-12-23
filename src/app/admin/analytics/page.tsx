'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  ArrowLeft, TrendingUp, Users, Vote, MapPin, Trophy, Crown,
  BarChart3, PieChart, Calendar, Download, Filter, RefreshCw
} from 'lucide-react';
import { districts, provinces } from '@/data/locations';

// Mock analytics data
const overviewStats = {
  totalContestants: 1247,
  totalVotes: 156892,
  activeVoters: 45678,
  avgVotesPerContestant: 126,
  contestantGrowth: '+12.5%',
  voteGrowth: '+8.3%',
  voterGrowth: '+15.2%',
};

const districtStats = [
  { id: 'colombo', name: 'Colombo', contestants: 156, votes: 24567, leader: 'Dilhani Perera' },
  { id: 'gampaha', name: 'Gampaha', contestants: 134, votes: 21234, leader: 'Sachini Fernando' },
  { id: 'kalutara', name: 'Kalutara', contestants: 89, votes: 15678, leader: 'Kavindi Silva' },
  { id: 'kandy', name: 'Kandy', contestants: 112, votes: 18456, leader: 'Nimesha Jayawardena' },
  { id: 'galle', name: 'Galle', contestants: 98, votes: 16789, leader: 'Tharushi Herath' },
  { id: 'matara', name: 'Matara', contestants: 76, votes: 12345, leader: 'Ishara Kumari' },
  { id: 'kurunegala', name: 'Kurunegala', contestants: 87, votes: 13456, leader: 'Amaya Gunaratne' },
  { id: 'jaffna', name: 'Jaffna', contestants: 65, votes: 9876, leader: 'Priya Chandran' },
];

const provinceStats = [
  { id: 'western', name: 'Western', contestants: 379, votes: 61479, percentage: 39.2 },
  { id: 'central', name: 'Central', contestants: 178, votes: 28912, percentage: 18.4 },
  { id: 'southern', name: 'Southern', contestants: 198, votes: 31567, percentage: 20.1 },
  { id: 'north-western', name: 'North Western', contestants: 134, votes: 19823, percentage: 12.6 },
  { id: 'northern', name: 'Northern', contestants: 89, votes: 12345, percentage: 7.9 },
  { id: 'eastern', name: 'Eastern', contestants: 67, votes: 8765, percentage: 5.6 },
  { id: 'north-central', name: 'North Central', contestants: 45, votes: 5678, percentage: 3.6 },
  { id: 'uva', name: 'Uva', contestants: 34, votes: 4567, percentage: 2.9 },
  { id: 'sabaragamuwa', name: 'Sabaragamuwa', contestants: 56, votes: 7890, percentage: 5.0 },
];

const dailyVotes = [
  { date: 'Mar 15', votes: 1234 },
  { date: 'Mar 16', votes: 1567 },
  { date: 'Mar 17', votes: 1890 },
  { date: 'Mar 18', votes: 2123 },
  { date: 'Mar 19', votes: 1876 },
  { date: 'Mar 20', votes: 2341 },
  { date: 'Mar 21', votes: 2567 },
];

const ageDistribution = [
  { age: '18-20', count: 312, percentage: 25 },
  { age: '21-23', count: 456, percentage: 37 },
  { age: '24-26', count: 298, percentage: 24 },
  { age: '27-28', count: 181, percentage: 14 },
];

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [dateRange, setDateRange] = useState('7d');

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

  const maxDailyVotes = Math.max(...dailyVotes.map(d => d.votes));
  const maxDistrictVotes = Math.max(...districtStats.map(d => d.votes));

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/dashboard" className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Analytics</h1>
            <p className="text-white/60">Competition statistics and insights</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                     focus:outline-none focus:border-royal-gold-500/50"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
          <button className="btn-secondary px-4 py-2 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-glow p-6">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-8 w-8 text-royal-gold-400" />
            <span className="text-green-400 text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {overviewStats.contestantGrowth}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{overviewStats.totalContestants.toLocaleString()}</p>
          <p className="text-white/60 text-sm">Total Contestants</p>
        </div>

        <div className="card-glow p-6">
          <div className="flex items-center justify-between mb-3">
            <Vote className="h-8 w-8 text-hot-pink-400" />
            <span className="text-green-400 text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {overviewStats.voteGrowth}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{overviewStats.totalVotes.toLocaleString()}</p>
          <p className="text-white/60 text-sm">Total Votes</p>
        </div>

        <div className="card-glow p-6">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-8 w-8 text-green-400" />
            <span className="text-green-400 text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {overviewStats.voterGrowth}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{overviewStats.activeVoters.toLocaleString()}</p>
          <p className="text-white/60 text-sm">Active Voters</p>
        </div>

        <div className="card-glow p-6">
          <div className="flex items-center justify-between mb-3">
            <BarChart3 className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{overviewStats.avgVotesPerContestant}</p>
          <p className="text-white/60 text-sm">Avg Votes/Contestant</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Votes Chart */}
        <div className="card-glow p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-royal-gold-400" />
            Daily Votes
          </h2>
          <div className="flex items-end justify-between h-48 space-x-2">
            {dailyVotes.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-royal-gold-500 to-hot-pink-500 rounded-t 
                           transition-all duration-300 hover:opacity-80 min-h-[20px]"
                  style={{ height: `${(day.votes / maxDailyVotes) * 100}%` }}
                />
                <p className="text-white/40 text-xs mt-2 whitespace-nowrap">{day.date}</p>
                <p className="text-white text-xs">{day.votes.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Age Distribution */}
        <div className="card-glow p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-royal-gold-400" />
            Age Distribution
          </h2>
          <div className="space-y-4">
            {ageDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white">{item.age} years</span>
                  <span className="text-white/60">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-royal-gold-500 to-hot-pink-500 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District Stats */}
      <div className="card-glow p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-royal-gold-400" />
          District Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 text-sm font-medium">District</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Contestants</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Total Votes</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Vote Share</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Current Leader</th>
              </tr>
            </thead>
            <tbody>
              {districtStats.map((district) => (
                <tr key={district.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-white/40" />
                      <span className="text-white">{district.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white">{district.contestants}</td>
                  <td className="p-4 text-white font-medium">{district.votes.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden max-w-[100px]">
                        <div 
                          className="h-full bg-gradient-to-r from-royal-gold-500 to-hot-pink-500 rounded-full"
                          style={{ width: `${(district.votes / maxDistrictVotes) * 100}%` }}
                        />
                      </div>
                      <span className="text-white/60 text-sm">
                        {((district.votes / overviewStats.totalVotes) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-royal-gold-400" />
                      <span className="text-white">{district.leader}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Province Stats */}
      <div className="card-glow p-6">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-royal-gold-400" />
          Province Overview
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {provinceStats.map((province) => (
            <div key={province.id} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">{province.name}</h3>
                <span className="text-royal-gold-400 text-sm font-medium">{province.percentage}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-royal-gold-500 to-hot-pink-500 rounded-full"
                  style={{ width: `${province.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">{province.contestants} contestants</span>
                <span className="text-white/60">{province.votes.toLocaleString()} votes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
