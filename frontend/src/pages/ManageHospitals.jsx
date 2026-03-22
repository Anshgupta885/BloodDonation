import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { Search, Download, MoreVertical, Building2, MapPin, Phone, Mail } from 'lucide-react';
import axios from 'axios';

export default function ManageHospitals({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admins/users?type=hospital', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHospitals(response.data?.users || []);
      } catch (_error) {
        setHospitals([]);
      }
    };

    fetchHospitals();
  }, []);

  const handleToggleBlock = async (hospital) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = hospital.isBlocked ? 'unblock' : 'block';
      await axios.patch(`/api/admins/users/hospital/${hospital.id}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHospitals(prev => prev.map(h => (
        h.id === hospital.id ? { ...h, isBlocked: !h.isBlocked } : h
      )));
    } catch (_error) {
      // Keep UI unchanged when request fails.
    }
  };

  const stats = [
    { label: 'Total Hospitals', value: hospitals.length, emoji: '🏥', bg: 'stat-purple' },
    { label: 'Unblocked', value: hospitals.filter(h => !h.isBlocked).length, emoji: '✅', bg: 'stat-green' },
    { label: 'Blocked', value: hospitals.filter(h => h.isBlocked).length, emoji: '🚫', bg: 'stat-red' },
    { label: 'With Pincode', value: hospitals.filter(h => h.pincode).length, emoji: '#', bg: 'stat-orange' },
  ];

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase());
    const statusLabel = h.isBlocked ? 'suspended' : 'verified';
    const matchesFilter = filterStatus === 'all' || statusLabel === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusConfig = (isBlocked) => {
    switch (isBlocked) {
      case false: return { bg: 'bg-green-100', text: 'text-green-700', emoji: '✅', label: 'Active' };
      case true: return { bg: 'bg-red-100', text: 'text-red-700', emoji: '🚫', label: 'Blocked' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', emoji: '❓' };
    }
  };

  const hospitalColors = ['#7c3aed', '#2563eb', '#10b981', '#f59e0b', '#ec4899', '#ff3b5c'];

  return (
    <DashboardLayout userType="admin" user={user} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Manage <span style={{ color: '#7c3aed' }}>Hospitals</span>
            </h1>
            <p className="text-gray-500 mt-1">View and manage all registered hospitals</p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 6px 20px rgba(16,185,129,0.35)' }}>
            <Download className="w-5 h-5" /> Export Data
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className={`rounded-2xl p-6 card-lift cursor-default ${stat.bg}`}>
              <div className="text-3xl mb-3">{stat.emoji}</div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or city..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-violet-400 transition-all" />
            </div>
            <div className="sm:w-44">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-violet-400 transition-all bg-white">
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hospital Cards (Grid layout instead of table for better visual) */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredHospitals.map((hospital, index) => {
            const sc = getStatusConfig(hospital.isBlocked);
            const color = hospitalColors[index % hospitalColors.length];
            return (
              <div key={hospital.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-lift">
                {/* Card top color bar */}
                <div className="h-1.5" style={{ background: color }} />
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}>
                        🏥
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm leading-tight">{hospital.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{hospital.email}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${sc.bg} ${sc.text}`}>
                      {sc.emoji} {sc.label}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{hospital.city} • {hospital.pincode || 'No pincode'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{hospital.phone || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-xl font-extrabold text-gray-900">{hospital.city || '-'}</p>
                      <p className="text-xs text-gray-400">City</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Joined</p>
                      <p className="text-xs font-semibold text-gray-600">{hospital.createdAt ? new Date(hospital.createdAt).getFullYear() : '-'}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleToggleBlock(hospital)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                          hospital.isBlocked ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {hospital.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">🏥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hospitals found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {filteredHospitals.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing <strong>{filteredHospitals.length}</strong> of <strong>{hospitals.length}</strong> hospitals</p>
            <div className="flex gap-2">
              {['← Prev', '1', '2', 'Next →'].map((label, i) => (
                <button key={i} className={`px-4 py-2 text-sm rounded-xl font-bold transition-all ${
                  label === '1' ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={label === '1' ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' } : {}}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
