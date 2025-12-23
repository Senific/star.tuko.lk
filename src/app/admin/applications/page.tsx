'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  Crown, Search, Filter, CheckCircle, XCircle, Eye, Clock,
  ArrowLeft, ChevronLeft, ChevronRight, Calendar, MapPin, Phone, Mail,
  User, FileText, Image as ImageIcon, X, Check, AlertTriangle, Loader2, RefreshCw, Video, Ruler, Trash2
} from 'lucide-react';
import { districts } from '@/data/locations';

// Application type matching database structure
interface Application {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  contestant: {
    id: string;
    tukoUserId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    email?: string;
    bio?: string;
    profilePhoto?: string;
    videoUrl?: string;
    height?: number;
    talents?: string[];
    district: { id: string; nameEn: string; nameSi: string; nameTa: string };
    province: { id: string; nameEn: string; nameSi: string; nameTa: string };
    photos: { id: string; url: string; isPrimary?: boolean; caption?: string }[];
  };
  approvedBy?: { id: string; name: string };
  rejectedBy?: { id: string; name: string };
}

type ApplicationStatus = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function ApplicationsPage() {
  const router = useRouter();
  const { admin, isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus>('all');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appToDelete, setAppToDelete] = useState<Application | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Fetch applications from API
  const fetchApplications = useCallback(async () => {
    setIsLoadingData(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (filterDistrict !== 'all') params.set('districtId', filterDistrict);
      if (searchQuery) params.set('search', searchQuery);
      params.set('page', currentPage.toString());
      params.set('limit', itemsPerPage.toString());

      const response = await fetch(`/api/admin/applications?${params}`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      
      const data = await response.json();
      setApplications(data.applications || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setIsLoadingData(false);
    }
  }, [filterStatus, filterDistrict, searchQuery, currentPage]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated, fetchApplications]);

  // Calculate counts from loaded data
  const pendingCount = applications.filter(a => a.status === 'PENDING').length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;

  const handleApprove = async (appId: string) => {
    if (!admin) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'approve', 
          adminId: admin.id,
          adminName: admin.name,
          adminPhone: admin.phone,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to approve application');
      
      // Refresh data
      await fetchApplications();
      setSelectedApp(null);
    } catch (err) {
      console.error('Error approving application:', err);
      alert('Failed to approve application. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (appId: string) => {
    if (!admin || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reject', 
          adminId: admin.id, 
          adminName: admin.name,
          adminPhone: admin.phone,
          rejectionReason: rejectionReason.trim() 
        }),
      });
      
      if (!response.ok) throw new Error('Failed to reject application');
      
      // Refresh data
      await fetchApplications();
      setSelectedApp(null);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (err) {
      console.error('Error rejecting application:', err);
      alert('Failed to reject application. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (app: Application) => {
    if (!admin) return;
    setActionLoading(true);
    try {
      const params = new URLSearchParams({
        adminId: admin.id,
        adminName: admin.name,
        adminPhone: admin.phone || '',
      });
      
      const response = await fetch(`/api/admin/applications/${app.id}?${params}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete application');
      
      // Refresh data
      await fetchApplications();
      setShowDeleteModal(false);
      setAppToDelete(null);
      setSelectedApp(null);
    } catch (err) {
      console.error('Error deleting application:', err);
      alert('Failed to delete application. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to get full name
  const getFullName = (app: Application) => 
    `${app.contestant.firstName} ${app.contestant.lastName}`;

  // Helper to calculate age
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statusColors = {
    PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    APPROVED: 'bg-green-500/20 text-green-400 border-green-500/30',
    REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-royal-gold-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/dashboard" className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Applications</h1>
            <p className="text-white/60">Review and manage contestant applications</p>
          </div>
        </div>
        <button
          onClick={fetchApplications}
          disabled={isLoadingData}
          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors 
                   disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`h-5 w-5 ${isLoadingData ? 'animate-spin' : ''}`} />
        </button>
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-glow p-4">
          <p className="text-white/60 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{totalCount}</p>
        </div>
        <div className="card-glow p-4">
          <p className="text-yellow-400 text-sm flex items-center">
            <Clock className="h-4 w-4 mr-1" /> Pending
          </p>
          <p className="text-2xl font-bold text-white">{pendingCount}</p>
        </div>
        <div className="card-glow p-4">
          <p className="text-green-400 text-sm flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" /> Approved
          </p>
          <p className="text-2xl font-bold text-white">{approvedCount}</p>
        </div>
        <div className="card-glow p-4">
          <p className="text-red-400 text-sm flex items-center">
            <XCircle className="h-4 w-4 mr-1" /> Rejected
          </p>
          <p className="text-2xl font-bold text-white">{rejectedCount}</p>
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white 
                       placeholder-white/40 focus:outline-none focus:border-royal-gold-500/50"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value as ApplicationStatus); setCurrentPage(1); }}
            className="bg-deep-purple-900 border border-white/10 rounded-lg px-4 py-2 text-white 
                     focus:outline-none focus:border-royal-gold-500/50 cursor-pointer
                     [&>option]:bg-deep-purple-900 [&>option]:text-white"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* District Filter */}
          <select
            value={filterDistrict}
            onChange={(e) => { setFilterDistrict(e.target.value); setCurrentPage(1); }}
            className="bg-deep-purple-900 border border-white/10 rounded-lg px-4 py-2 text-white 
                     focus:outline-none focus:border-royal-gold-500/50 cursor-pointer
                     [&>option]:bg-deep-purple-900 [&>option]:text-white"
          >
            <option value="all">All Districts</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>{district.name.en}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card-glow overflow-hidden">
        {isLoadingData ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 text-royal-gold-400 animate-spin" />
            <span className="ml-3 text-white/60">Loading applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="h-12 w-12 text-white/20 mb-4" />
            <p className="text-white/60">No applications found</p>
            <p className="text-white/40 text-sm mt-1">
              {filterStatus !== 'all' || filterDistrict !== 'all' || searchQuery
                ? 'Try adjusting your filters'
                : 'Applications will appear here when contestants submit them'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/60 text-sm font-medium">Applicant</th>
                    <th className="text-left p-4 text-white/60 text-sm font-medium">District</th>
                    <th className="text-left p-4 text-white/60 text-sm font-medium">Age</th>
                    <th className="text-left p-4 text-white/60 text-sm font-medium">Applied Date</th>
                    <th className="text-left p-4 text-white/60 text-sm font-medium">Status</th>
                    <th className="text-center p-4 text-white/60 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-royal-gold-400 to-hot-pink-500 
                                        flex items-center justify-center text-white font-bold overflow-hidden">
                            {app.contestant.photos?.[0] ? (
                              <img 
                                src={app.contestant.photos[0].url} 
                                alt={getFullName(app)} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              app.contestant.firstName.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{getFullName(app)}</p>
                            <p className="text-white/40 text-sm">{app.contestant.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white">{app.contestant.district?.nameEn || '-'}</td>
                      <td className="p-4 text-white">{calculateAge(app.contestant.dateOfBirth)}</td>
                      <td className="p-4 text-white/60">{formatDate(app.submittedAt)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                        border ${statusColors[app.status]}`}>
                          {app.status === 'PENDING' && <Clock className="h-3 w-3 mr-1" />}
                          {app.status === 'APPROVED' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {app.status === 'REJECTED' && <XCircle className="h-3 w-3 mr-1" />}
                          {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => setSelectedApp(app)}
                            className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {app.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleApprove(app.id)}
                                disabled={actionLoading}
                                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 
                                         transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => { setSelectedApp(app); setShowRejectModal(true); }}
                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 
                                         transition-colors"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => { setAppToDelete(app); setShowDeleteModal(true); }}
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 
                                     transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <p className="text-white/60 text-sm">
                  Page {currentPage} of {totalPages} ({totalCount} total)
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
          </>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApp && !showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" 
             onClick={() => setSelectedApp(null)}>
          <div className="bg-deep-purple-900/95 backdrop-blur-lg border border-white/10 rounded-2xl 
                        max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
               onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Application Details</h2>
              <button onClick={() => setSelectedApp(null)} className="text-white/60 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Applicant Info */}
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-royal-gold-400 to-hot-pink-500 
                              flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {selectedApp.contestant.profilePhoto ? (
                    <img 
                      src={selectedApp.contestant.profilePhoto} 
                      alt={getFullName(selectedApp)} 
                      className="h-full w-full object-cover"
                    />
                  ) : selectedApp.contestant.photos?.[0] ? (
                    <img 
                      src={selectedApp.contestant.photos[0].url} 
                      alt={getFullName(selectedApp)} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    selectedApp.contestant.firstName.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{getFullName(selectedApp)}</h3>
                  <p className="text-white/60">Tuko ID: {selectedApp.contestant.tukoUserId}</p>
                  <span className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-medium 
                                  border ${statusColors[selectedApp.status]}`}>
                    {selectedApp.status.charAt(0) + selectedApp.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/40 text-sm flex items-center mb-1">
                    <User className="h-4 w-4 mr-2" /> Age
                  </p>
                  <p className="text-white">{calculateAge(selectedApp.contestant.dateOfBirth)} years old</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/40 text-sm flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-2" /> Date of Birth
                  </p>
                  <p className="text-white">{formatDate(selectedApp.contestant.dateOfBirth)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/40 text-sm flex items-center mb-1">
                    <MapPin className="h-4 w-4 mr-2" /> Location
                  </p>
                  <p className="text-white">
                    {selectedApp.contestant.district?.nameEn}, {selectedApp.contestant.province?.nameEn}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/40 text-sm flex items-center mb-1">
                    <Phone className="h-4 w-4 mr-2" /> Phone
                  </p>
                  <p className="text-white">{selectedApp.contestant.phone}</p>
                </div>
                {selectedApp.contestant.email && (
                  <div className="bg-white/5 rounded-lg p-4 md:col-span-2">
                    <p className="text-white/40 text-sm flex items-center mb-1">
                      <Mail className="h-4 w-4 mr-2" /> Email
                    </p>
                    <p className="text-white">{selectedApp.contestant.email}</p>
                  </div>
                )}
              </div>

              {/* Bio */}
              {selectedApp.contestant.bio && (
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/40 text-sm flex items-center mb-2">
                    <FileText className="h-4 w-4 mr-2" /> Bio
                  </p>
                  <p className="text-white">{selectedApp.contestant.bio}</p>
                </div>
              )}

              {/* Height & Talents */}
              {(selectedApp.contestant.height || (selectedApp.contestant.talents && selectedApp.contestant.talents.length > 0)) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedApp.contestant.height && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/40 text-sm flex items-center mb-1">
                        <Ruler className="h-4 w-4 mr-2" /> Height
                      </p>
                      <p className="text-white">{selectedApp.contestant.height} cm</p>
                    </div>
                  )}
                  {selectedApp.contestant.talents && selectedApp.contestant.talents.length > 0 && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/40 text-sm mb-2">Talents</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.contestant.talents.map((talent, i) => (
                          <span key={i} className="bg-royal-gold-500/20 text-royal-gold-400 text-xs px-2 py-1 rounded">
                            {talent}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Photos */}
              {(selectedApp.contestant.profilePhoto || (selectedApp.contestant.photos && selectedApp.contestant.photos.length > 0)) && (
                <div>
                  <p className="text-white/40 text-sm flex items-center mb-3">
                    <ImageIcon className="h-4 w-4 mr-2" /> Photos
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Profile Photo */}
                    {selectedApp.contestant.profilePhoto && (
                      <div className="aspect-[3/4] bg-white/10 rounded-lg overflow-hidden relative">
                        <img 
                          src={selectedApp.contestant.profilePhoto} 
                          alt="Profile Photo" 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <span className="absolute bottom-2 left-2 bg-royal-gold-500/80 text-white text-xs px-2 py-1 rounded">
                          Profile
                        </span>
                      </div>
                    )}
                    {/* Additional Photos */}
                    {selectedApp.contestant.photos?.map((photo) => (
                      <div key={photo.id} className="aspect-[3/4] bg-white/10 rounded-lg overflow-hidden">
                        <img 
                          src={photo.url} 
                          alt="Photo" 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {selectedApp.contestant.videoUrl && (
                <div>
                  <p className="text-white/40 text-sm flex items-center mb-3">
                    <Video className="h-4 w-4 mr-2" /> Introduction Video
                  </p>
                  <div className="aspect-video bg-white/10 rounded-lg overflow-hidden">
                    <video 
                      src={selectedApp.contestant.videoUrl} 
                      controls 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Submitted Date */}
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/40 text-sm mb-1">Submitted</p>
                <p className="text-white">{formatDate(selectedApp.submittedAt)}</p>
              </div>

              {/* Rejection Reason (if rejected) */}
              {selectedApp.status === 'REJECTED' && selectedApp.rejectionReason && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 text-sm flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 mr-2" /> Rejection Reason
                  </p>
                  <p className="text-white">{selectedApp.rejectionReason}</p>
                  {selectedApp.rejectedBy && selectedApp.reviewedAt && (
                    <p className="text-white/40 text-sm mt-2">
                      Rejected by {selectedApp.rejectedBy.name} on {formatDate(selectedApp.reviewedAt)}
                    </p>
                  )}
                </div>
              )}

              {/* Approval info */}
              {selectedApp.status === 'APPROVED' && selectedApp.approvedBy && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-400 text-sm flex items-center mb-2">
                    <CheckCircle className="h-4 w-4 mr-2" /> Approved
                  </p>
                  <p className="text-white/40 text-sm">
                    Approved by {selectedApp.approvedBy.name} on {formatDate(selectedApp.reviewedAt!)}
                  </p>
                </div>
              )}

              {/* Actions */}
              {selectedApp.status === 'PENDING' && (
                <div className="flex space-x-4 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => handleApprove(selectedApp.id)}
                    disabled={actionLoading}
                    className="flex-1 btn-primary py-3 flex items-center justify-center disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" /> Approve Application
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                    className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg py-3 
                             flex items-center justify-center hover:bg-red-500/30 transition-colors 
                             disabled:opacity-50"
                  >
                    <X className="h-5 w-5 mr-2" /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-deep-purple-900/95 backdrop-blur-lg border border-white/10 rounded-2xl 
                        max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Reject Application</h2>
            <p className="text-white/60 mb-4">
              Please provide a reason for rejecting the application from <strong className="text-white">{getFullName(selectedApp)}</strong>.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white 
                       placeholder-white/40 focus:outline-none focus:border-royal-gold-500/50 h-32"
            />
            <div className="flex space-x-4 mt-4">
              <button 
                onClick={() => { setShowRejectModal(false); setRejectionReason(''); }}
                disabled={actionLoading}
                className="flex-1 btn-secondary py-3"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleReject(selectedApp.id)}
                disabled={!rejectionReason.trim() || actionLoading}
                className="flex-1 bg-red-500 text-white rounded-lg py-3 hover:bg-red-600 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
                         flex items-center justify-center"
              >
                {actionLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Confirm Reject'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && appToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-deep-purple-900/95 backdrop-blur-lg border border-red-500/30 rounded-2xl 
                        max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-full">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Delete Application</h2>
            </div>
            <p className="text-white/60 mb-2">
              Are you sure you want to permanently delete the application from:
            </p>
            <p className="text-white font-semibold text-lg mb-4">
              {appToDelete.contestant.firstName} {appToDelete.contestant.lastName}
            </p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm flex items-start">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                This action cannot be undone. All contestant data, photos, votes, and related records will be permanently removed.
              </p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => { setShowDeleteModal(false); setAppToDelete(null); }}
                disabled={actionLoading}
                className="flex-1 btn-secondary py-3"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(appToDelete)}
                disabled={actionLoading}
                className="flex-1 bg-red-500 text-white rounded-lg py-3 hover:bg-red-600 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
                         flex items-center justify-center"
              >
                {actionLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
