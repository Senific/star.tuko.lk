'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  ArrowLeft, Save, Bell, Shield, Globe, Palette, Mail,
  Lock, Users, Vote, AlertTriangle, Check, Eye, EyeOff
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { admin, isAuthenticated, isLoading, hasPermission } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General
    siteName: 'Beauty 2026',
    siteDescription: 'Sri Lanka\'s Premier Island-wide Beauty Contest',
    contactEmail: 'info@star.tuko.lk',
    supportPhone: '+94 11 234 5678',
    
    // Voting
    votingEnabled: true,
    maxVotesPerUser: 1,
    votingStartTime: '00:00',
    votingEndTime: '23:59',
    requireTukoAuth: true,
    
    // Registration
    registrationOpen: true,
    minAge: 18,
    maxAge: 28,
    maxPhotos: 5,
    requireVideo: false,
    
    // Notifications
    emailNotifications: true,
    newApplicationAlert: true,
    voteThresholdAlert: true,
    voteThreshold: 1000,
    reportAlert: true,
    
    // Security
    twoFactorEnabled: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    ipWhitelist: '',
  });

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

  const handleSave = () => {
    // Simulate saving
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'voting', name: 'Voting', icon: Vote },
    { id: 'registration', name: 'Registration', icon: Users },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/dashboard" className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Settings</h1>
            <p className="text-white/60">Manage competition settings and configurations</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary px-6 py-2 flex items-center space-x-2"
        >
          {saved ? <Check className="h-5 w-5" /> : <Save className="h-5 w-5" />}
          <span>{saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-royal-gold-500/20 text-royal-gold-400 border border-royal-gold-500/30'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card-glow p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-royal-gold-400" />
                  General Settings
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:border-royal-gold-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:border-royal-gold-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Site Description</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                             focus:outline-none focus:border-royal-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Support Phone</label>
                  <input
                    type="tel"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                             focus:outline-none focus:border-royal-gold-500/50"
                  />
                </div>
              </div>
            )}

            {/* Voting Settings */}
            {activeTab === 'voting' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Vote className="h-5 w-5 mr-2 text-royal-gold-400" />
                  Voting Settings
                </h2>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Enable Voting</p>
                    <p className="text-white/40 text-sm">Allow users to vote for contestants</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, votingEnabled: !settings.votingEnabled })}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.votingEnabled ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                      settings.votingEnabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Require Tuko Authentication</p>
                    <p className="text-white/40 text-sm">Only Tuko app users can vote</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, requireTukoAuth: !settings.requireTukoAuth })}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.requireTukoAuth ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                      settings.requireTukoAuth ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Max Votes Per User (per contestant)</label>
                    <input
                      type="number"
                      min="1"
                      value={settings.maxVotesPerUser}
                      onChange={(e) => setSettings({ ...settings, maxVotesPerUser: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:border-royal-gold-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Voting Start</label>
                      <input
                        type="time"
                        value={settings.votingStartTime}
                        onChange={(e) => setSettings({ ...settings, votingStartTime: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                                 focus:outline-none focus:border-royal-gold-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Voting End</label>
                      <input
                        type="time"
                        value={settings.votingEndTime}
                        onChange={(e) => setSettings({ ...settings, votingEndTime: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                                 focus:outline-none focus:border-royal-gold-500/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Settings */}
            {activeTab === 'registration' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-royal-gold-400" />
                  Registration Settings
                </h2>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Registration Open</p>
                    <p className="text-white/40 text-sm">Allow new contestant registrations</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, registrationOpen: !settings.registrationOpen })}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.registrationOpen ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                      settings.registrationOpen ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Minimum Age</label>
                    <input
                      type="number"
                      min="18"
                      value={settings.minAge}
                      onChange={(e) => setSettings({ ...settings, minAge: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:border-royal-gold-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Maximum Age</label>
                    <input
                      type="number"
                      max="35"
                      value={settings.maxAge}
                      onChange={(e) => setSettings({ ...settings, maxAge: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:border-royal-gold-500/50"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Maximum Photos</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.maxPhotos}
                      onChange={(e) => setSettings({ ...settings, maxPhotos: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:border-royal-gold-500/50"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Require Video</p>
                      <p className="text-white/40 text-sm">Make video mandatory</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, requireVideo: !settings.requireVideo })}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        settings.requireVideo ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                        settings.requireVideo ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-royal-gold-400" />
                  Notification Settings
                </h2>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-white/40 text-sm">Receive notifications via email</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">New Application Alerts</p>
                    <p className="text-white/40 text-sm">Get notified for new applications</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, newApplicationAlert: !settings.newApplicationAlert })}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.newApplicationAlert ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                      settings.newApplicationAlert ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Vote Threshold Alerts</p>
                    <p className="text-white/40 text-sm">Alert when contestant reaches vote threshold</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, voteThresholdAlert: !settings.voteThresholdAlert })}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.voteThresholdAlert ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                      settings.voteThresholdAlert ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                {settings.voteThresholdAlert && (
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Vote Threshold</label>
                    <input
                      type="number"
                      value={settings.voteThreshold}
                      onChange={(e) => setSettings({ ...settings, voteThreshold: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:border-royal-gold-500/50"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Report Alerts</p>
                    <p className="text-white/40 text-sm">Get notified for new content reports</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, reportAlert: !settings.reportAlert })}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.reportAlert ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                      settings.reportAlert ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-royal-gold-400" />
                  Security Settings
                </h2>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className="text-white/40 text-sm">Require 2FA for admin login</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, twoFactorEnabled: !settings.twoFactorEnabled })}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.twoFactorEnabled ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                      settings.twoFactorEnabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      min="15"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:border-royal-gold-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Max Login Attempts</label>
                    <input
                      type="number"
                      min="3"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:border-royal-gold-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">IP Whitelist (comma separated)</label>
                  <textarea
                    value={settings.ipWhitelist}
                    onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
                    placeholder="e.g., 192.168.1.1, 10.0.0.1"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                             placeholder-white/40 focus:outline-none focus:border-royal-gold-500/50"
                  />
                  <p className="text-white/40 text-xs mt-1">Leave empty to allow all IPs</p>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-medium">Security Notice</p>
                      <p className="text-white/60 text-sm mt-1">
                        Changing security settings may require all admins to re-authenticate. 
                        Make sure you have access to recovery options before enabling 2FA.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
