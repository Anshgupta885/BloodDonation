import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { Search, Download, MoreVertical, User, Droplet, MapPin, Phone } from 'lucide-react';
import axios from 'axios';

export default function ManageDonors({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admins/users?type=donor', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDonors(response.data?.users || []);
      } catch (_error) {
        setDonors([]);
      }
    };

    fetchDonors();
  }, []);

  const handleToggleBlock = async (donor) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = donor.isBlocked ? 'unblock' : 'block';
      await axios.patch(`/api/admins/users/donor/${donor.id}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDonors(prev => prev.map(d => (
        d.id === donor.id ? { ...d, isBlocked: !d.isBlocked } : d
      )));
    } catch (_error) {
      // Keep UI unchanged when request fails.
    }
  };

  const bloodGroupColors = {
    'A+': '#ff3b5c', 'A-': '#ff6b35', 'B+': '#7c3aed', 'B-': '#2563eb',
    'AB+': '#10b981', 'AB-': '#f59e0b', 'O+': '#ec4899', 'O-': '#6366f1',
  };

  const stats = [
    { label: 'Total Donors', value: donors.length, emoji: '👥', bg: 'stat-blue' },
    { label: 'Unblocked', value: donors.filter(d => !d.isBlocked).length, emoji: '🟢', bg: 'stat-green' },
    { label: 'Blocked', value: donors.filter(d => d.isBlocked).length, emoji: '🔴', bg: 'stat-red' },
    { label: 'With Pincode', value: donors.filter(d => d.pincode).length, emoji: '#', bg: 'stat-orange' },
  ];

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const statusLabel = donor.isBlocked ? 'suspended' : 'active';
    const matchesFilter = filterStatus === 'all' || statusLabel === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusConfig = (isBlocked) => {
    switch (isBlocked) {
      case false: return { bg: 'bg-green-100', text: 'text-green-700', emoji: '🟢', label: 'Active' };
      case true: return { bg: 'bg-red-100', text: 'text-red-700', emoji: '🔴', label: 'Blocked' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', emoji: '⚫' };
    }
  };

  return (
    <DashboardLayout userType="admin" user={user} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Manage <span style={{ color: '#3b82f6' }}>Donors</span>
            </h1>
            <p className="text-gray-500 mt-1">View and manage all registered donors</p>
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
                placeholder="Search by name, email, or blood group..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-all" />
            </div>
            <div className="sm:w-44">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-all bg-white">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #f8f7ff, #fff5f5)' }}>
                  {['Donor', 'Blood Group', 'Location', 'Contact', 'Donations', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDonors.map((donor) => {
                  const sc = getStatusConfig(donor.isBlocked);
                  return (
                    <tr key={donor.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                            style={{ background: `linear-gradient(135deg, ${bloodGroupColors[donor.bloodGroup] || '#ff3b5c'}, ${bloodGroupColors[donor.bloodGroup] || '#ff3b5c'}88)` }}>
                            {donor.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{donor.name}</p>
                            <p className="text-xs text-gray-400">{donor.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-gray-100 text-gray-700"
                        >
                          #{donor.pincode || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {donor.city || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {donor.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-sm font-bold text-rose-600">
                            {donor.donationCount || 0}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${sc.bg} ${sc.text}`}>
                          {sc.emoji} {sc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleBlock(donor)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                            donor.isBlocked ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {donor.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredDonors.length === 0 && (
            <div className="p-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No donors found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredDonors.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing <strong>{filteredDonors.length}</strong> of <strong>{donors.length}</strong> donors</p>
            <div className="flex gap-2">
              {['← Prev', '1', '2', 'Next →'].map((label, i) => (
                <button key={i} className={`px-4 py-2 text-sm rounded-xl font-bold transition-all ${
                  label === '1' ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={label === '1' ? { background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' } : {}}>
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
