'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  ArrowLeft, Search, Filter, Eye, Edit, Trash2, MoreVertical,
  Star, Ban, CheckCircle, ChevronLeft, ChevronRight, Crown, Medal,
  MapPin, Vote, Calendar, ExternalLink, X
} from 'lucide-react';
import { districts, provinces } from '@/data/locations';

// Mock contestants data
const mockContestants = [
  {
    id: 'C001',
    name: 'Dilhani Perera',
    age: 23,
    district: 'colombo',
    province: 'western',
    votes: 12456,
    rank: 1,
    districtRank: 1,
    status: 'active',
    featured: true,
    joinedDate: '2026-03-20',
    lastVote: '2026-03-21',
  },
  {
    id: 'C002',
    name: 'Sachini Fernando',
    age: 21,
    district: 'gampaha',
    province: 'western',
    votes: 11234,
    rank: 2,
    districtRank: 1,
    status: 'active',
    featured: true,
    joinedDate: '2026-03-20',
    lastVote: '2026-03-21',
  },
  {
    id: 'C003',
    name: 'Kavindi Silva',
    age: 25,
    district: 'kalutara',
    province: 'western',
    votes: 10987,
    rank: 3,
    districtRank: 1,
    status: 'active',
    featured: false,
    joinedDate: '2026-03-20',
    lastVote: '2026-03-21',
  },
  {
    id: 'C004',
    name: 'Nimesha Jayawardena',
    age: 22,
    district: 'kandy',
    province: 'central',
    votes: 10456,
    rank: 4,
    districtRank: 1,
    status: 'active',
    featured: false,
    joinedDate: '2026-03-20',
    lastVote: '2026-03-20',
  },
  {
    id: 'C005',
    name: 'Tharushi Herath',
    age: 24,
    district: 'galle',
    province: 'southern',
    votes: 9876,
    rank: 5,
    districtRank: 1,
    status: 'active',
    featured: true,
    joinedDate: '2026-03-20',
    lastVote: '2026-03-21',
  },
  {
    id: 'C006',
    name: 'Ishara Kumari',
    age: 20,
    district: 'matara',
    province: 'southern',
    votes: 8765,
    rank: 6,
    districtRank: 2,
    status: 'suspended',
    featured: false,
    joinedDate: '2026-03-20',
    lastVote: '2026-03-19',
    suspendReason: 'Vote manipulation suspected',
  },
  {
    id: 'C007',
    name: 'Amaya Gunaratne',
    age: 26,
    district: 'kurunegala',
    province: 'north-western',
    votes: 7654,
    rank: 7,
    districtRank: 1,
    status: 'active',
    featured: false,
    joinedDate: '2026-03-21',
    lastVote: '2026-03-21',
  },
];

type ContestantStatus = 'all' | 'active' | 'suspended';

export default function ContestantsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [contestants, setContestants] = useState(mockContestants);
  const [filterStatus, setFilterStatus] = useState<ContestantStatus>('all');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [filterProvince, setFilterProvince] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContestant, setSelectedContestant] = useState<typeof mockContestants[0] | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
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

  const filteredContestants = contestants.filter(c => {
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesDistrict = filterDistrict === 'all' || c.district === filterDistrict;
    const matchesProvince = filterProvince === 'all' || c.province === filterProvince;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesDistrict && matchesProvince && matchesSearch;
  });

  const totalPages = Math.ceil(filteredContestants.length / itemsPerPage);
  const paginatedContestants = filteredContestants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFeature = (contestantId: string) => {
    setContestants(prev => prev.map(c => 
      c.id === contestantId ? { ...c, featured: !c.featured } : c
    ));
    setShowActionMenu(null);
  };

  const handleSuspend = (contestantId: string) => {
    setContestants(prev => prev.map(c => 
      c.id === contestantId 
        ? { ...c, status: c.status === 'suspended' ? 'active' : 'suspended' }
        : c
    ));
    setShowActionMenu(null);
  };

  const activeCount = contestants.filter(c => c.status === 'active').length;
  const suspendedCount = contestants.filter(c => c.status === 'suspended').length;
  const featuredCount = contestants.filter(c => c.featured).length;
  const totalVotes = contestants.reduce((sum, c) => sum + c.votes, 0);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/dashboard" className="text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Contestants</h1>
          <p className="text-white/60">Manage all registered contestants</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-glow p-4">
          <p className="text-white/60 text-sm">Total Contestants</p>
          <p className="text-2xl font-bold text-white">{contestants.length}</p>
        </div>
        <div className="card-glow p-4">
          <p className="text-green-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-white">{activeCount}</p>
        </div>
        <div className="card-glow p-4">
          <p className="text-royal-gold-400 text-sm flex items-center">
            <Star className="h-4 w-4 mr-1" /> Featured
          </p>
          <p className="text-2xl font-bold text-white">{featuredCount}</p>
        </div>
        <div className="card-glow p-4">
          <p className="text-white/60 text-sm">Total Votes</p>
          <p className="text-2xl font-bold text-white">{totalVotes.toLocaleString()}</p>
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
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white 
                       placeholder-white/40 focus:outline-none focus:border-royal-gold-500/50"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ContestantStatus)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                     focus:outline-none focus:border-royal-gold-500/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Province Filter */}
          <select
            value={filterProvince}
            onChange={(e) => { setFilterProvince(e.target.value); setFilterDistrict('all'); }}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                     focus:outline-none focus:border-royal-gold-500/50"
          >
            <option value="all">All Provinces</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>{province.name.en}</option>
            ))}
          </select>

          {/* District Filter */}
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                     focus:outline-none focus:border-royal-gold-500/50"
          >
            <option value="all">All Districts</option>
            {districts
              .filter(d => filterProvince === 'all' || d.provinceId === filterProvince)
              .map((district) => (
                <option key={district.id} value={district.id}>{district.name.en}</option>
              ))}
          </select>
        </div>
      </div>

      {/* Contestants Table */}
      <div className="card-glow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 text-sm font-medium">Rank</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Contestant</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Location</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Votes</th>
                <th className="text-left p-4 text-white/60 text-sm font-medium">Status</th>
                <th className="text-center p-4 text-white/60 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedContestants.map((contestant) => {
                const district = districts.find(d => d.id === contestant.district);
                const province = provinces.find(p => p.id === contestant.province);
                
                return (
                  <tr key={contestant.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                        contestant.rank === 1 ? 'bg-yellow-500' : 
                        contestant.rank === 2 ? 'bg-gray-400' : 
                        contestant.rank === 3 ? 'bg-amber-600' : 'bg-white/20'
                      }`}>
                        {contestant.rank <= 3 ? (
                          <Crown className="h-5 w-5" />
                        ) : (
                          contestant.rank
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-royal-gold-400 to-hot-pink-500 
                                      flex items-center justify-center text-white font-bold">
                          {contestant.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-white font-medium">{contestant.name}</p>
                            {contestant.featured && (
                              <Star className="h-4 w-4 text-royal-gold-400 fill-royal-gold-400" />
                            )}
                          </div>
                          <p className="text-white/40 text-sm">{contestant.id} • Age {contestant.age}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white">{district?.name.en}</p>
                        <p className="text-white/40 text-sm">{province?.name.en}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{contestant.votes.toLocaleString()}</p>
                        <p className="text-white/40 text-sm">District #{contestant.districtRank}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        contestant.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {contestant.status === 'active' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Ban className="h-3 w-3 mr-1" />
                        )}
                        {contestant.status.charAt(0).toUpperCase() + contestant.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2 relative">
                        <button 
                          onClick={() => setSelectedContestant(contestant)}
                          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link 
                          href={`/contestant/${contestant.id}`}
                          target="_blank"
                          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                          title="View Public Profile"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <div className="relative">
                          <button 
                            onClick={() => setShowActionMenu(showActionMenu === contestant.id ? null : contestant.id)}
                            className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {showActionMenu === contestant.id && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-deep-purple-900 border border-white/10 
                                          rounded-lg shadow-lg z-10">
                              <button 
                                onClick={() => handleFeature(contestant.id)}
                                className="w-full text-left px-4 py-3 text-white hover:bg-white/5 flex items-center space-x-2"
                              >
                                <Star className={`h-4 w-4 ${contestant.featured ? 'fill-royal-gold-400 text-royal-gold-400' : ''}`} />
                                <span>{contestant.featured ? 'Remove from Featured' : 'Add to Featured'}</span>
                              </button>
                              <button 
                                onClick={() => handleSuspend(contestant.id)}
                                className={`w-full text-left px-4 py-3 hover:bg-white/5 flex items-center space-x-2 ${
                                  contestant.status === 'suspended' ? 'text-green-400' : 'text-red-400'
                                }`}
                              >
                                <Ban className="h-4 w-4" />
                                <span>{contestant.status === 'suspended' ? 'Reactivate' : 'Suspend'}</span>
                              </button>
                            </div>
                          )}
                        </div>
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
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredContestants.length)} of {filteredContestants.length}
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

      {/* Contestant Detail Modal */}
      {selectedContestant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" 
             onClick={() => setSelectedContestant(null)}>
          <div className="bg-deep-purple-900/95 backdrop-blur-lg border border-white/10 rounded-2xl 
                        max-w-lg w-full max-h-[90vh] overflow-y-auto" 
               onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Contestant Details</h2>
              <button onClick={() => setSelectedContestant(null)} className="text-white/60 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contestant Info */}
              <div className="text-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-royal-gold-400 to-hot-pink-500 
                              flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                  {selectedContestant.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
                  <span>{selectedContestant.name}</span>
                  {selectedContestant.featured && (
                    <Star className="h-5 w-5 text-royal-gold-400 fill-royal-gold-400" />
                  )}
                </h3>
                <p className="text-white/60">{selectedContestant.id}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <Crown className="h-8 w-8 text-royal-gold-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">#{selectedContestant.rank}</p>
                  <p className="text-white/40 text-sm">Overall Rank</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <Vote className="h-8 w-8 text-hot-pink-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{selectedContestant.votes.toLocaleString()}</p>
                  <p className="text-white/40 text-sm">Total Votes</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60">District</span>
                  <span className="text-white">
                    {districts.find(d => d.id === selectedContestant.district)?.name.en}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60">Province</span>
                  <span className="text-white">
                    {provinces.find(p => p.id === selectedContestant.province)?.name.en}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60">District Rank</span>
                  <span className="text-white">#{selectedContestant.districtRank}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60">Joined Date</span>
                  <span className="text-white">{selectedContestant.joinedDate}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60">Last Vote</span>
                  <span className="text-white">{selectedContestant.lastVote}</span>
                </div>
              </div>

              {/* Suspension Info */}
              {selectedContestant.status === 'suspended' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 font-medium flex items-center mb-2">
                    <Ban className="h-4 w-4 mr-2" /> Suspended
                  </p>
                  <p className="text-white/60">{selectedContestant.suspendReason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4 pt-4 border-t border-white/10">
                <button 
                  onClick={() => handleFeature(selectedContestant.id)}
                  className={`flex-1 py-3 rounded-lg flex items-center justify-center transition-colors ${
                    selectedContestant.featured
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-royal-gold-500/20 text-royal-gold-400 border border-royal-gold-500/30 hover:bg-royal-gold-500/30'
                  }`}
                >
                  <Star className={`h-5 w-5 mr-2 ${selectedContestant.featured ? 'fill-royal-gold-400 text-royal-gold-400' : ''}`} />
                  {selectedContestant.featured ? 'Remove Featured' : 'Add to Featured'}
                </button>
                <button 
                  onClick={() => handleSuspend(selectedContestant.id)}
                  className={`flex-1 py-3 rounded-lg flex items-center justify-center transition-colors ${
                    selectedContestant.status === 'suspended'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  }`}
                >
                  <Ban className="h-5 w-5 mr-2" />
                  {selectedContestant.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
