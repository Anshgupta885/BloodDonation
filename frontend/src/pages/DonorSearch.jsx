import React, { useState, useEffect } from 'react';
import { Search, MapPin, Droplet, Phone, Mail, Filter, User, X, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function DonorSearch({ user }) {
  const [filters, setFilters] = useState({ bloodGroup: 'all', city: '', pincode: '', availability: 'all' });
  const [showFilters, setShowFilters] = useState(false);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const bloodGroupColors = {
    'A+': '#ff3b5c', 'A-': '#ff6b35', 'B+': '#7c3aed', 'B-': '#2563eb',
    'AB+': '#10b981', 'AB-': '#f59e0b', 'O+': '#ec4899', 'O-': '#6366f1',
  };

  const fetchDonors = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/donors/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setDonors(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch donors.');
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [filters.bloodGroup, filters.availability, filters.pincode]);

  const handleContactDonor = (donor) => {
    const email = donor.email ? `mailto:${donor.email}` : null;
    const phone = donor.phone ? `tel:${donor.phone}` : null;

    if (phone) {
      window.location.href = phone;
      return;
    }

    if (email) {
      window.location.href = email;
      return;
    }

    window.alert('No contact details available for this donor.');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Find <span style={{ color: '#ff3b5c' }}>Donors</span>
          </h1>
          <p className="text-gray-500 mt-1">Find available blood donors in your area</p>
        </div>
      </div>

      {/* Search Bar + Filter Toggle */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search donors by city..." value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl outline-none focus:border-rose-400 transition-all shadow-sm bg-white text-base" />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm border-2 transition-all ${
              showFilters ? 'border-rose-400 text-rose-600 bg-rose-50' : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
            }`}>
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
          <button type="submit" className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 whitespace-nowrap">
            Search
          </button>
        </div>
      </form>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid sm:grid-cols-4 gap-8">
            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Blood Group</label>
              <div className="grid grid-cols-3 gap-2">
                {bloodGroups.map((group) => (
                  <button key={group} type="button" onClick={() => setFilters({ ...filters, bloodGroup: group })}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      filters.bloodGroup === group 
                        ? 'text-white shadow-lg border-transparent' 
                        : 'bg-white text-gray-600 border-gray-100 hover:border-rose-200 hover:bg-rose-50'
                    }`}
                    style={filters.bloodGroup === group && group !== 'all' ? {
                      background: bloodGroupColors[group] || '#ff3b5c'
                    } : filters.bloodGroup === group ? {
                      background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)'
                    } : {}}>
                    {group === 'all' ? 'All' : group}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" name="city" value={filters.city} onChange={handleFilterChange}
                  placeholder="Enter city" className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-rose-400 transition-all bg-gray-50/50" />
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pincode</label>
              <input type="text" name="pincode" value={filters.pincode} onChange={handleFilterChange}
                placeholder="Enter pincode" className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-rose-400 transition-all bg-gray-50/50" />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Status</label>
              <div className="space-y-2">
                {[{ id: 'all', label: '👥 All Donors' }, { id: 'available', label: '🟢 Available Now' }, { id: 'unavailable', label: '⚫ Not Available' }].map(opt => (
                  <button key={opt.id} type="button" onClick={() => setFilters({ ...filters, availability: opt.id })}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                      filters.availability === opt.id
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
            <button onClick={() => setFilters({ bloodGroup: 'all', city: '', pincode: '', availability: 'all' })}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-400 hover:text-rose-500 transition-colors">
              <X className="w-4 h-4" /> Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Results Count & Error */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-700">{donors.length} results</span>
          </div>
          {filters.bloodGroup !== 'all' && (
            <span className="px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-lg"
              style={{ background: bloodGroupColors[filters.bloodGroup] || '#ff3b5c' }}>
              🩸 {filters.bloodGroup}
            </span>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
            <X className="w-4 h-4" />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}
      </div>

      {/* Donor Cards */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-rose-100 border-t-rose-500 animate-spin" />
            <Droplet className="absolute inset-0 m-auto w-6 h-6 text-rose-500" />
          </div>
          <p className="text-gray-400 font-medium animate-pulse">Finding life-savers...</p>
        </div>
      ) : donors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => {
            const color = bloodGroupColors[donor.bloodGroup] || '#ff3b5c';
            return (
              <div key={donor.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 border border-gray-100 overflow-hidden transition-all duration-300 card-lift">
                <div className="h-2" style={{ background: color }} />
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}>
                        {donor.name ? donor.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{donor.name || 'Anonymous Donor'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2.5 h-2.5 rounded-full ${donor.available ? 'bg-green-500 pulse-green' : 'bg-gray-300'}`} />
                          <span className={`text-xs font-bold tracking-wide uppercase ${donor.available ? 'text-green-600' : 'text-gray-400'}`}>
                            {donor.available ? 'Active Now' : 'Away'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-2 text-white text-sm font-black rounded-2xl shadow-md"
                      style={{ background: color }}>
                      {donor.bloodGroup}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <span className="text-sm font-semibold">{donor.city || 'Unknown Location'}</span>
                    </div>
                    {donor.pincode && (
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <span className="w-4 h-4 text-center text-rose-400 font-bold">#</span>
                        <span className="text-sm font-semibold">{donor.pincode}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                       <div className="flex items-center gap-2 text-gray-500 text-xs font-bold bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                         <Phone className="w-3.5 h-3.5" />
                         <span className="truncate">{donor.phone || 'N/A'}</span>
                       </div>
                       <div className="flex items-center gap-2 text-gray-500 text-xs font-bold bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                         <Mail className="w-3.5 h-3.5" />
                         <span className="truncate">{donor.email || 'N/A'}</span>
                       </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Eligibility</span>
                      <span className={`text-xs font-bold ${donor.available ? 'text-green-600' : 'text-gray-400'}`}>
                        {donor.available ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <button 
                      disabled={!donor.available}
                      onClick={() => handleContactDonor(donor)}
                      className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
                        donor.available
                          ? 'text-white hover:shadow-xl active:scale-95'
                          : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      }`}
                      style={donor.available ? { 
                        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                        boxShadow: `0 8px 20px ${color}30`
                      } : {}}>
                      Contact Donor
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No donors match your search</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Try broadening your search criteria or searching in a different city</p>
          <button 
            onClick={() => setFilters({ bloodGroup: 'all', city: '', pincode: '', availability: 'all' })}
            className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
