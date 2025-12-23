'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Filter, MapPin, Grid, List, SortAsc, Loader2 } from 'lucide-react';
import ContestantCard from '@/components/contestants/ContestantCard';
import { districts, provinces, getDistrictsByProvince } from '@/data/locations';

// Contestant type for the page
interface ContestantData {
  id: string;
  contestantNo: string | null;
  name: string;
  firstName: string;
  lastName: string;
  age: number;
  bio: string;
  profilePhoto: string;
  photos: string[];
  districtId: string;
  district: string;
  provinceId: string;
  province: string;
  votes: number;
  talents: string[];
  status: string;
  createdAt: string;
}

export default function ContestantsPage() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [sortBy, setSortBy] = useState<'votes' | 'name' | 'recent'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [contestants, setContestants] = useState<ContestantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingEnabled, setVotingEnabled] = useState(false);

  // Fetch voting status
  useEffect(() => {
    const fetchVotingStatus = async () => {
      try {
        const response = await fetch('/api/settings/voting-status');
        const data = await response.json();
        setVotingEnabled(data.votingEnabled);
        // If voting is enabled, default sort by votes
        if (data.votingEnabled) {
          setSortBy('votes');
        }
      } catch (error) {
        console.error('Error fetching voting status:', error);
      }
    };
    fetchVotingStatus();
  }, []);

  // Fetch contestants from API
  useEffect(() => {
    const fetchContestants = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedProvince !== 'all') params.append('provinceId', selectedProvince);
        if (selectedDistrict !== 'all') params.append('districtId', selectedDistrict);
        params.append('sortBy', sortBy);
        
        const response = await fetch(`/api/contestants?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch contestants');
        }
        const data = await response.json();
        setContestants(data.contestants || []);
      } catch (err) {
        console.error('Error fetching contestants:', err);
        setError('Failed to load contestants. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchContestants, searchQuery ? 300 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedProvince, selectedDistrict, sortBy]);

  // Filter and sort contestants (client-side for additional sorting)
  const filteredContestants = useMemo(() => {
    let result = [...contestants];

    // Sort by recent if selected (API doesn't handle this well with vote sorting)
    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [contestants, sortBy]);

  // Get available districts based on selected province
  const availableDistricts = useMemo(() => {
    if (selectedProvince === 'all') return districts;
    return getDistrictsByProvince(selectedProvince);
  }, [selectedProvince]);

  // Reset district when province changes
  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setSelectedDistrict('all');
  };

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
            {t('nav.contestants')}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Browse all contestants competing in Beauty 2026. Vote for your favorites!
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="text"
                  placeholder={`${t('general.search')} contestants...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5
                           text-white placeholder-white/40 focus:outline-none focus:border-royal-gold-500/50"
                />
              </div>
            </div>

            {/* Province Filter */}
            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <select
                  value={selectedProvince}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5
                           text-white focus:outline-none focus:border-royal-gold-500/50 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-deep-purple-900">All Provinces</option>
                  {provinces.map(province => (
                    <option key={province.id} value={province.id} className="bg-deep-purple-900">
                      {province.name[language]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* District Filter */}
            <div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5
                         text-white focus:outline-none focus:border-royal-gold-500/50 appearance-none cursor-pointer"
              >
                <option value="all" className="bg-deep-purple-900">All Districts</option>
                {availableDistricts.map(district => (
                  <option key={district.id} value={district.id} className="bg-deep-purple-900">
                    {district.name[language]}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <div className="relative">
                <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5
                           text-white focus:outline-none focus:border-royal-gold-500/50 appearance-none cursor-pointer"
                >
                  <option value="votes" className="bg-deep-purple-900">Most Votes</option>
                  <option value="name" className="bg-deep-purple-900">Name (A-Z)</option>
                  <option value="recent" className="bg-deep-purple-900">Most Recent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count & View Toggle */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <p className="text-white/60 text-sm">
              Showing <span className="text-royal-gold-400 font-semibold">{filteredContestants.length}</span> contestants
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-royal-gold-500/20 text-royal-gold-400' : 'text-white/40 hover:text-white/60'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-royal-gold-500/20 text-royal-gold-400' : 'text-white/40 hover:text-white/60'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Contestants Grid */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 text-royal-gold-400 animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-lg">Loading contestants...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        ) : filteredContestants.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredContestants.map((contestant, index) => (
              <ContestantCard 
                key={contestant.id} 
                contestant={contestant}
                rank={sortBy === 'votes' ? index + 1 : undefined}
                showRank={votingEnabled && sortBy === 'votes'}
                votingEnabled={votingEnabled}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg mb-4">No contestants found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedProvince('all');
                setSelectedDistrict('all');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
