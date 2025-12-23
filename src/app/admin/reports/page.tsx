'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  ArrowLeft, Search, CheckCircle, XCircle, Eye, AlertTriangle,
  ChevronLeft, ChevronRight, Flag, MessageSquare, Image, User,
  Clock, Shield, X
} from 'lucide-react';

// Mock reports data
const mockReports = [
  {
    id: 'RPT001',
    type: 'inappropriate_photo',
    contestantId: 'C006',
    contestantName: 'Ishara Kumari',
    reportedBy: 'TK123456',
    reason: 'Photo appears to be edited/filtered beyond acceptable limits',
    timestamp: '2026-03-21 10:15:32',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 'RPT002',
    type: 'fake_profile',
    contestantId: 'C012',
    contestantName: 'Samantha Dias',
    reportedBy: 'TK234567',
    reason: 'Photos appear to be taken from social media of another person',
    timestamp: '2026-03-21 09:45:18',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 'RPT003',
    type: 'vote_manipulation',
    contestantId: 'C008',
    contestantName: 'Rashmika Silva',
    reportedBy: 'System',
    reason: 'Unusual voting pattern detected - 50 votes within 5 minutes from similar IPs',
    timestamp: '2026-03-21 08:30:45',
    status: 'investigating',
    priority: 'critical',
  },
  {
    id: 'RPT004',
    type: 'inappropriate_content',
    contestantId: 'C015',
    contestantName: 'Nethmi Perera',
    reportedBy: 'TK345678',
    reason: 'Bio contains inappropriate language',
    timestamp: '2026-03-20 16:22:10',
    status: 'resolved',
    priority: 'medium',
    resolution: 'Content updated by contestant after warning',
    resolvedBy: 'Moderator',
    resolvedAt: '2026-03-20 18:45:00',
  },
  {
    id: 'RPT005',
    type: 'underage_suspect',
    contestantId: 'C020',
    contestantName: 'Kavishka Fernando',
    reportedBy: 'TK456789',
    reason: 'Contestant appears younger than stated age of 18',
    timestamp: '2026-03-20 14:10:55',
    status: 'resolved',
    priority: 'high',
    resolution: 'Age verified through ID documents - confirmed 19 years old',
    resolvedBy: 'Admin',
    resolvedAt: '2026-03-20 16:30:00',
  },
];

type ReportStatus = 'all' | 'pending' | 'investigating' | 'resolved' | 'dismissed';
type ReportType = 'all' | 'inappropriate_photo' | 'fake_profile' | 'vote_manipulation' | 'inappropriate_content' | 'underage_suspect';

const reportTypeLabels: Record<string, string> = {
  inappropriate_photo: 'Inappropriate Photo',
  fake_profile: 'Fake Profile',
  vote_manipulation: 'Vote Manipulation',
  inappropriate_content: 'Inappropriate Content',
  underage_suspect: 'Underage Suspect',
};

const reportTypeIcons: Record<string, React.ElementType> = {
  inappropriate_photo: Image,
  fake_profile: User,
  vote_manipulation: Flag,
  inappropriate_content: MessageSquare,
  underage_suspect: Shield,
};

export default function ReportsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [reports, setReports] = useState(mockReports);
  const [filterStatus, setFilterStatus] = useState<ReportStatus>('all');
  const [filterType, setFilterType] = useState<ReportType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesSearch = report.contestantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = (reportId: string, action: 'investigating' | 'resolved' | 'dismissed') => {
    setReports(prev => prev.map(r => 
      r.id === reportId 
        ? { 
            ...r, 
            status: action,
            ...(action === 'resolved' || action === 'dismissed' ? {
              resolvedBy: 'Admin',
              resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              resolution: action === 'dismissed' ? 'Report dismissed after review' : 'Issue addressed'
            } : {})
          }
        : r
    ));
    setSelectedReport(null);
  };

  const priorityColors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    investigating: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
    dismissed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const investigatingCount = reports.filter(r => r.status === 'investigating').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;
  const criticalCount = reports.filter(r => r.priority === 'critical' && r.status !== 'resolved' && r.status !== 'dismissed').length;

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/dashboard" className="text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Reports</h1>
          <p className="text-white/60">Review and manage reported content</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-glow p-4">
          <p className="text-yellow-400 text-sm flex items-center">
            <Clock className="h-4 w-4 mr-1" /> Pending
          </p>
          <p className="text-2xl font-bold text-white">{pendingCount}</p>
        </div>
        <div className="card-glow p-4">
          <p className="text-blue-400 text-sm flex items-center">
            <Eye className="h-4 w-4 mr-1" /> Investigating
          </p>
          <p className="text-2xl font-bold text-white">{investigatingCount}</p>
        </div>
        <div className="card-glow p-4">
          <p className="text-green-400 text-sm flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" /> Resolved
          </p>
          <p className="text-2xl font-bold text-white">{resolvedCount}</p>
        </div>
        <div className="card-glow p-4">
          <p className="text-red-400 text-sm flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" /> Critical
          </p>
          <p className="text-2xl font-bold text-white">{criticalCount}</p>
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
              placeholder="Search by contestant name or report ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white 
                       placeholder-white/40 focus:outline-none focus:border-royal-gold-500/50"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ReportStatus)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                     focus:outline-none focus:border-royal-gold-500/50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ReportType)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                     focus:outline-none focus:border-royal-gold-500/50"
          >
            <option value="all">All Types</option>
            <option value="inappropriate_photo">Inappropriate Photo</option>
            <option value="fake_profile">Fake Profile</option>
            <option value="vote_manipulation">Vote Manipulation</option>
            <option value="inappropriate_content">Inappropriate Content</option>
            <option value="underage_suspect">Underage Suspect</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="card-glow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 text-sm font-medium">Report</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Type</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Contestant</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Priority</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Status</th>
                <th className="text-center p-4 text-white/60 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map((report) => {
                const TypeIcon = reportTypeIcons[report.type] || Flag;
                return (
                  <tr key={report.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-mono text-sm">{report.id}</p>
                        <p className="text-white/40 text-sm">{report.timestamp}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-4 w-4 text-white/60" />
                        <span className="text-white text-sm">{reportTypeLabels[report.type]}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-royal-gold-400 to-hot-pink-500 
                                      flex items-center justify-center text-white text-xs font-bold">
                          {report.contestantName.charAt(0)}
                        </div>
                        <span className="text-white">{report.contestantName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                      border ${priorityColors[report.priority as keyof typeof priorityColors]}`}>
                        {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                      border ${statusColors[report.status as keyof typeof statusColors]}`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {report.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleAction(report.id, 'investigating')}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 
                                       transition-colors"
                              title="Start Investigation"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleAction(report.id, 'dismissed')}
                              className="p-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 
                                       transition-colors"
                              title="Dismiss"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {report.status === 'investigating' && (
                          <button 
                            onClick={() => handleAction(report.id, 'resolved')}
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 
                                     transition-colors"
                            title="Mark Resolved"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
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
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length}
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

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" 
             onClick={() => setSelectedReport(null)}>
          <div className="bg-deep-purple-900/95 backdrop-blur-lg border border-white/10 rounded-2xl 
                        max-w-lg w-full max-h-[90vh] overflow-y-auto" 
               onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Report Details</h2>
              <button onClick={() => setSelectedReport(null)} className="text-white/60 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Report Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-mono">{selectedReport.id}</p>
                  <p className="text-white/40 text-sm">{selectedReport.timestamp}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                  border ${priorityColors[selectedReport.priority as keyof typeof priorityColors]}`}>
                    {selectedReport.priority.charAt(0).toUpperCase() + selectedReport.priority.slice(1)}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                  border ${statusColors[selectedReport.status as keyof typeof statusColors]}`}>
                    {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Type */}
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/40 text-sm mb-2">Report Type</p>
                <div className="flex items-center space-x-2">
                  {(() => {
                    const TypeIcon = reportTypeIcons[selectedReport.type] || Flag;
                    return <TypeIcon className="h-5 w-5 text-royal-gold-400" />;
                  })()}
                  <span className="text-white font-medium">{reportTypeLabels[selectedReport.type]}</span>
                </div>
              </div>

              {/* Contestant */}
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/40 text-sm mb-2">Reported Contestant</p>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-royal-gold-400 to-hot-pink-500 
                                flex items-center justify-center text-white font-bold">
                    {selectedReport.contestantName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedReport.contestantName}</p>
                    <p className="text-white/40 text-sm">{selectedReport.contestantId}</p>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/40 text-sm mb-2">Reason</p>
                <p className="text-white">{selectedReport.reason}</p>
              </div>

              {/* Reporter */}
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/40 text-sm mb-1">Reported By</p>
                <p className="text-royal-gold-400 font-mono">{selectedReport.reportedBy}</p>
              </div>

              {/* Resolution (if resolved) */}
              {(selectedReport.status === 'resolved' || selectedReport.status === 'dismissed') && selectedReport.resolution && (
                <div className={`rounded-lg p-4 ${
                  selectedReport.status === 'resolved' 
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-gray-500/10 border border-gray-500/30'
                }`}>
                  <p className={`text-sm mb-2 ${
                    selectedReport.status === 'resolved' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    Resolution
                  </p>
                  <p className="text-white">{selectedReport.resolution}</p>
                  <p className="text-white/40 text-sm mt-2">
                    By {selectedReport.resolvedBy} on {selectedReport.resolvedAt}
                  </p>
                </div>
              )}

              {/* Actions */}
              {selectedReport.status === 'pending' && (
                <div className="flex space-x-4 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => handleAction(selectedReport.id, 'investigating')}
                    className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg py-3 
                             flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                  >
                    <Eye className="h-5 w-5 mr-2" /> Investigate
                  </button>
                  <button 
                    onClick={() => handleAction(selectedReport.id, 'dismissed')}
                    className="flex-1 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-lg py-3 
                             flex items-center justify-center hover:bg-gray-500/30 transition-colors"
                  >
                    <XCircle className="h-5 w-5 mr-2" /> Dismiss
                  </button>
                </div>
              )}

              {selectedReport.status === 'investigating' && (
                <div className="flex space-x-4 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => handleAction(selectedReport.id, 'resolved')}
                    className="flex-1 btn-primary py-3 flex items-center justify-center"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" /> Mark Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
