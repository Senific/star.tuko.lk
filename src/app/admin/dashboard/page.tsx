'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  Crown, Users, Vote, Trophy, FileCheck, AlertTriangle, TrendingUp,
  Calendar, LogOut, Menu, X, LayoutDashboard, UserCheck, BarChart3,
  Settings, Bell, Flag, ChevronRight, Eye, CheckCircle, XCircle,
  Clock, Loader2, RefreshCw
} from 'lucide-react';

// Types for dashboard data
interface DashboardStats {
  totalContestants: number;
  pendingApplications: number;
  approvedContestants: number;
  rejectedApplications: number;
  totalVotes: number;
  todayVotes: number;
  districts: number;
  reportedContent: number;
}

interface RecentApplication {
  id: string;
  name: string;
  district: string;
  date: string;
  status: string;
}

interface TopContestant {
  id: string;
  name: string;
  district: string;
  votes: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { admin, isAuthenticated, isLoading, logout, hasPermission } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dashboard data states
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalContestants: 0,
    pendingApplications: 0,
    approvedContestants: 0,
    rejectedApplications: 0,
    totalVotes: 0,
    todayVotes: 0,
    districts: 0,
    reportedContent: 0,
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [topContestants, setTopContestants] = useState<TopContestant[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setDashboardStats(data.stats);
      setRecentApplications(data.recentApplications || []);
      setTopContestants(data.topContestants || []);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated, fetchDashboardStats]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-royal-gold-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, active: true },
    { name: 'Contestants', href: '/admin/contestants', icon: Users },
    { name: 'Applications', href: '/admin/applications', icon: FileCheck, badge: dashboardStats.pendingApplications },
    { name: 'Votes', href: '/admin/votes', icon: Vote },
    { name: 'Reports', href: '/admin/reports', icon: Flag, badge: dashboardStats.reportedContent },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Schedule', href: '/admin/schedule', icon: Calendar },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const alerts = [
    ...(dashboardStats.reportedContent > 0 ? [{ type: 'warning', message: `${dashboardStats.reportedContent} content reports pending review`, link: '/admin/reports' }] : []),
    ...(dashboardStats.pendingApplications > 0 ? [{ type: 'info', message: `${dashboardStats.pendingApplications} applications awaiting review`, link: '/admin/applications' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-purple-900 via-[#1a0a1a] to-deep-purple-900">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Crown className="h-8 w-8 text-royal-gold-400" />
          <span className="font-display font-bold text-white">Admin Panel</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-deep-purple-900/95 backdrop-blur-lg p-4" onClick={e => e.stopPropagation()}>
            <nav className="space-y-2">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    link.active 
                      ? 'bg-royal-gold-500/20 text-royal-gold-400' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <link.icon className="h-5 w-5" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-hot-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block ${sidebarOpen ? 'w-64' : 'w-20'} min-h-screen bg-white/5 backdrop-blur-sm 
                         border-r border-white/10 transition-all duration-300`}>
          {/* Logo */}
          <div className="p-4 border-b border-white/10">
            <Link href="/admin/dashboard" className="flex items-center space-x-3">
              <Crown className="h-10 w-10 text-royal-gold-400" />
              {sidebarOpen && (
                <div>
                  <span className="font-display font-bold text-white text-lg">Beauty 2026</span>
                  <p className="text-white/40 text-xs">Admin Panel</p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  link.active 
                    ? 'bg-royal-gold-500/20 text-royal-gold-400 border border-royal-gold-500/30' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <link.icon className="h-5 w-5" />
                  {sidebarOpen && <span>{link.name}</span>}
                </div>
                {link.badge && sidebarOpen && (
                  <span className="bg-hot-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-royal-gold-400 to-hot-pink-500 
                              flex items-center justify-center text-white font-bold">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                {sidebarOpen && (
                  <div>
                    <p className="text-white text-sm font-medium">{admin?.name}</p>
                    <p className="text-white/40 text-xs capitalize">{admin?.role?.replace('_', ' ')}</p>
                  </div>
                )}
              </div>
              {sidebarOpen && (
                <button onClick={() => logout()} className="text-white/40 hover:text-red-400 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-white/60">Welcome back, {admin?.name}</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button className="relative p-2 text-white/60 hover:text-white transition-colors">
                <Bell className="h-6 w-6" />
                {(dashboardStats.pendingApplications > 0 || dashboardStats.reportedContent > 0) && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-hot-pink-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={fetchDashboardStats}
                disabled={isLoadingData}
                className="p-2 text-white/60 hover:text-white transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`h-5 w-5 ${isLoadingData ? 'animate-spin' : ''}`} />
              </button>
              <Link href="/" target="_blank" className="btn-secondary text-sm px-4 py-2">
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {error}
              </p>
            </div>
          )}

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-3 mb-8">
              {alerts.map((alert, index) => (
                <Link
                  key={index}
                  href={alert.link}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    alert.type === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                      : alert.type === 'info'
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                      : 'bg-green-500/10 border-green-500/30 text-green-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{alert.message}</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              ))}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card-glow p-6">
              <div className="flex items-center justify-between mb-3">
                <Users className="h-8 w-8 text-royal-gold-400" />
                <span className="text-green-400 text-sm">Active</span>
              </div>
              <p className="text-3xl font-bold text-white">{dashboardStats.totalContestants.toLocaleString()}</p>
              <p className="text-white/60 text-sm">Total Contestants</p>
            </div>

            <div className="card-glow p-6">
              <div className="flex items-center justify-between mb-3">
                <FileCheck className="h-8 w-8 text-hot-pink-400" />
                <span className="bg-hot-pink-500/20 text-hot-pink-400 text-sm px-2 py-0.5 rounded-full">
                  {dashboardStats.pendingApplications} New
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{dashboardStats.pendingApplications}</p>
              <p className="text-white/60 text-sm">Pending Applications</p>
            </div>

            <div className="card-glow p-6">
              <div className="flex items-center justify-between mb-3">
                <Vote className="h-8 w-8 text-green-400" />
                <span className="text-green-400 text-sm flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +{dashboardStats.todayVotes.toLocaleString()}
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{dashboardStats.totalVotes.toLocaleString()}</p>
              <p className="text-white/60 text-sm">Total Votes</p>
            </div>

            <div className="card-glow p-6">
              <div className="flex items-center justify-between mb-3">
                <Trophy className="h-8 w-8 text-yellow-400" />
                <span className="text-white/40 text-sm">{dashboardStats.districts} Districts</span>
              </div>
              <p className="text-3xl font-bold text-white">Registration</p>
              <p className="text-white/60 text-sm">Current Phase</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Applications */}
            <div className="card-glow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Recent Applications</h2>
                <Link href="/admin/applications" className="text-royal-gold-400 hover:text-royal-gold-300 text-sm">
                  View All →
                </Link>
              </div>
              {isLoadingData ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 text-royal-gold-400 animate-spin" />
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="text-center py-8">
                  <FileCheck className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60">No applications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-royal-gold-400 to-hot-pink-500 
                                      flex items-center justify-center text-white text-sm font-bold">
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{app.name}</p>
                          <p className="text-white/40 text-sm">{app.district} • {app.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {app.status === 'pending' ? (
                          <span className="text-yellow-400 text-sm flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Pending
                          </span>
                        ) : app.status === 'approved' ? (
                          <span className="text-green-400 text-sm flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approved
                          </span>
                        ) : (
                          <span className="text-red-400 text-sm flex items-center">
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Contestants */}
            <div className="card-glow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Top Contestants</h2>
                <Link href="/admin/contestants" className="text-royal-gold-400 hover:text-royal-gold-300 text-sm">
                  View All →
                </Link>
              </div>
              {isLoadingData ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 text-royal-gold-400 animate-spin" />
                </div>
              ) : topContestants.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60">No votes recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topContestants.map((contestant, index) => (
                    <div key={contestant.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-white/20'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{contestant.name}</p>
                          <p className="text-white/40 text-sm">{contestant.district}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{contestant.votes.toLocaleString()}</p>
                        <p className="text-white/40 text-sm">votes</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/applications" className="card-glow p-4 text-center hover:border-royal-gold-500/50 
                                                        transition-colors group">
              <UserCheck className="h-8 w-8 text-royal-gold-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-medium">Review Applications</p>
              <p className="text-white/40 text-sm">{dashboardStats.pendingApplications} pending</p>
            </Link>
            <Link href="/admin/votes" className="card-glow p-4 text-center hover:border-royal-gold-500/50 
                                                 transition-colors group">
              <Vote className="h-8 w-8 text-hot-pink-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-medium">Monitor Votes</p>
              <p className="text-white/40 text-sm">Real-time tracking</p>
            </Link>
            <Link href="/admin/reports" className="card-glow p-4 text-center hover:border-royal-gold-500/50 
                                                   transition-colors group">
              <Flag className="h-8 w-8 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-medium">Review Reports</p>
              <p className="text-white/40 text-sm">{dashboardStats.reportedContent} reports</p>
            </Link>
            <Link href="/admin/schedule" className="card-glow p-4 text-center hover:border-royal-gold-500/50 
                                                    transition-colors group">
              <Calendar className="h-8 w-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-medium">Manage Schedule</p>
              <p className="text-white/40 text-sm">Update timeline</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
