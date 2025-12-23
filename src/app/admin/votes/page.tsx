'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  ArrowLeft, Search, Filter, Eye, AlertTriangle, Clock,
  ChevronLeft, ChevronRight, Vote, TrendingUp, TrendingDown,
  BarChart3, Users, Calendar, RefreshCw, Download, MapPin
} from 'lucide-react';
import { districts, provinces } from '@/data/locations';

// Mock votes data
const mockVotes = [
  { id: 'V001', voterId: 'TK123456', contestantId: 'C001', contestantName: 'Dilhani Perera', district: 'colombo', timestamp: '2026-03-21 14:32:15', ip: '192.168.1.xxx' },
  { id: 'V002', voterId: 'TK234567', contestantId: 'C002', contestantName: 'Sachini Fernando', district: 'gampaha', timestamp: '2026-03-21 14:31:42', ip: '192.168.2.xxx' },
  { id: 'V003', voterId: 'TK345678', contestantId: 'C001', contestantName: 'Dilhani Perera', district: 'colombo', timestamp: '2026-03-21 14:30:28', ip: '192.168.3.xxx' },
  { id: 'V004', voterId: 'TK456789', contestantId: 'C003', contestantName: 'Kavindi Silva', district: 'kalutara', timestamp: '2026-03-21 14:29:55', ip: '192.168.4.xxx' },
  { id: 'V005', voterId: 'TK567890', contestantId: 'C005', contestantName: 'Tharushi Herath', district: 'galle', timestamp: '2026-03-21 14:28:10', ip: '192.168.5.xxx' },
  { id: 'V006', voterId: 'TK678901', contestantId: 'C004', contestantName: 'Nimesha Jayawardena', district: 'kandy', timestamp: '2026-03-21 14:27:33', ip: '192.168.6.xxx' },
  { id: 'V007', voterId: 'TK789012', contestantId: 'C002', contestantName: 'Sachini Fernando', district: 'gampaha', timestamp: '2026-03-21 14:26:45', ip: '192.168.7.xxx' },
  { id: 'V008', voterId: 'TK890123', contestantId: 'C001', contestantName: 'Dilhani Perera', district: 'colombo', timestamp: '2026-03-21 14:25:12', ip: '192.168.8.xxx' },
];

const voteStats = {
  totalVotes: 156892,
  todayVotes: 2341,
  yesterdayVotes: 2156,
  thisWeekVotes: 15678,
  averagePerDay: 2234,
  peakHour: '20:00 - 21:00',
  topDistrict: 'Colombo',
  activeVoters: 45678,
};

const hourlyData = [
  { hour: '00:00', votes: 234 },
  { hour: '01:00', votes: 156 },
  { hour: '02:00', votes: 98 },
  { hour: '03:00', votes: 45 },
  { hour: '04:00', votes: 32 },
  { hour: '05:00', votes: 67 },
  { hour: '06:00', votes: 189 },
  { hour: '07:00', votes: 345 },
  { hour: '08:00', votes: 456 },
  { hour: '09:00', votes: 523 },
  { hour: '10:00', votes: 612 },
  { hour: '11:00', votes: 589 },
  { hour: '12:00', votes: 634 },
  { hour: '13:00', votes: 567 },
  { hour: '14:00', votes: 489 },
  { hour: '15:00', votes: 534 },
  { hour: '16:00', votes: 623 },
  { hour: '17:00', votes: 712 },
  { hour: '18:00', votes: 834 },
  { hour: '19:00', votes: 923 },
  { hour: '20:00', votes: 1045 },
  { hour: '21:00', votes: 987 },
  { hour: '22:00', votes: 756 },
  { hour: '23:00', votes: 456 },
];

const suspiciousActivity = [
  { type: 'rapid_voting', description: 'Multiple votes from same IP in short period', count: 3, severity: 'high' },
  { type: 'unusual_pattern', description: 'Unusual voting pattern detected', count: 2, severity: 'medium' },
  { type: 'vpn_detected', description: 'VPN/Proxy usage detected', count: 5, severity: 'low' },
];

export default function VotesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  // Auto refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-royal-gold-400"></div>
      </div>
    );
  }

  const filteredVotes = mockVotes.filter(vote => {
    const matchesDistrict = filterDistrict === 'all' || vote.district === filterDistrict;
    const matchesSearch = vote.contestantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vote.voterId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  const totalPages = Math.ceil(filteredVotes.length / itemsPerPage);
  const paginatedVotes = filteredVotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxVotes = Math.max(...hourlyData.map(d => d.votes));

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/dashboard" className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Vote Monitoring</h1>
            <p className="text-white/60">Real-time vote tracking and analytics</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 text-white/60 text-sm">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              autoRefresh 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/10 text-white/60 border border-white/10'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>Auto Refresh</span>
          </button>
          <button className="btn-secondary px-4 py-2 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-glow p-4">
          <p className="text-white/60 text-sm">Total Votes</p>
          <p className="text-2xl font-bold text-white">{voteStats.totalVotes.toLocaleString()}</p>
          <p className="text-green-400 text-sm flex items-center mt-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            +{voteStats.todayVotes.toLocaleString()} today
          </p>
        </div>
        <div className="card-glow p-4">
          <p className="text-white/60 text-sm">This Week</p>
          <p className="text-2xl font-bold text-white">{voteStats.thisWeekVotes.toLocaleString()}</p>
          <p className="text-white/40 text-sm mt-1">
            Avg {voteStats.averagePerDay.toLocaleString()}/day
          </p>
        </div>
        <div className="card-glow p-4">
          <p className="text-white/60 text-sm">Peak Hour</p>
          <p className="text-2xl font-bold text-white">{voteStats.peakHour}</p>
          <p className="text-white/40 text-sm mt-1">Most active voting time</p>
        </div>
        <div className="card-glow p-4">
          <p className="text-white/60 text-sm">Active Voters</p>
          <p className="text-2xl font-bold text-white">{voteStats.activeVoters.toLocaleString()}</p>
          <p className="text-white/40 text-sm mt-1">Unique Tuko users</p>
        </div>
      </div>

      {/* Hourly Chart & Alerts */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Hourly Votes Chart */}
        <div className="lg:col-span-2 card-glow p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-royal-gold-400" />
            Today's Voting Activity
          </h2>
          <div className="flex items-end space-x-1 h-48">
            {hourlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-royal-gold-500 to-hot-pink-500 rounded-t 
                           transition-all duration-300 hover:opacity-80"
                  style={{ height: `${(data.votes / maxVotes) * 100}%` }}
                  title={`${data.hour}: ${data.votes} votes`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-white/40 text-xs">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>

        {/* Suspicious Activity Alerts */}
        <div className="card-glow p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
            Suspicious Activity
          </h2>
          <div className="space-y-4">
            {suspiciousActivity.map((alert, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${
                  alert.severity === 'high' 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : alert.severity === 'medium'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    alert.severity === 'high' 
                      ? 'text-red-400' 
                      : alert.severity === 'medium'
                      ? 'text-yellow-400'
                      : 'text-blue-400'
                  }`}>
                    {alert.count} instances
                  </span>
                  <span className={`text-xs uppercase px-2 py-0.5 rounded ${
                    alert.severity === 'high' 
                      ? 'bg-red-500/20 text-red-400' 
                      : alert.severity === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-white/60 text-sm">{alert.description}</p>
              </div>
            ))}
          </div>
          <Link href="/admin/reports" className="block text-center text-royal-gold-400 hover:text-royal-gold-300 
                                                 text-sm mt-4 pt-4 border-t border-white/10">
            View All Reports →
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card-glow p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by contestant name or voter ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white 
                       placeholder-white/40 focus:outline-none focus:border-royal-gold-500/50"
            />
          </div>

          {/* District Filter */}
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                     focus:outline-none focus:border-royal-gold-500/50"
          >
            <option value="all">All Districts</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>{district.name.en}</option>
            ))}
          </select>

          {/* Date Filter (placeholder) */}
          <input
            type="date"
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                     focus:outline-none focus:border-royal-gold-500/50"
          />
        </div>
      </div>

      {/* Recent Votes Table */}
      <div className="card-glow overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Recent Votes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 text-sm font-medium">Vote ID</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Voter</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Contestant</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">District</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Timestamp</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVotes.map((vote) => {
                const district = districts.find(d => d.id === vote.district);
                return (
                  <tr key={vote.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white/60 font-mono text-sm">{vote.id}</td>
                    <td className="p-4">
                      <span className="text-royal-gold-400 font-mono text-sm">{vote.voterId}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-royal-gold-400 to-hot-pink-500 
                                      flex items-center justify-center text-white text-xs font-bold">
                          {vote.contestantName.charAt(0)}
                        </div>
                        <span className="text-white">{vote.contestantName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-white/40" />
                        {district?.name.en}
                      </span>
                    </td>
                    <td className="p-4 text-white/60 text-sm">{vote.timestamp}</td>
                    <td className="p-4 text-white/40 font-mono text-sm">{vote.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/10">
            <p className="text-white/60 text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredVotes.length)} of {filteredVotes.length}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-white px-4">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
