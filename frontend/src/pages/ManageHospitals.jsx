import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { Search, Download, MoreVertical, CheckCircle, Clock, XCircle, Building2, MapPin, Phone, Mail } from 'lucide-react';

export default function ManageHospitals({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const hospitals = [
    { id: 1, name: 'City General Hospital', email: 'info@citygeneral.com', city: 'New York', address: '123 Main St', phone: '+1 (555) 100-0001', requests: 45, status: 'Verified', joinDate: '2022-01-10' },
    { id: 2, name: 'St. Mary Medical Center', email: 'contact@stmary.com', city: 'Los Angeles', address: '456 Health Ave', phone: '+1 (555) 100-0002', requests: 38, status: 'Verified', joinDate: '2022-03-15' },
    { id: 3, name: 'Memorial Hospital', email: 'admin@memorial.com', city: 'Chicago', address: '789 Care Blvd', phone: '+1 (555) 100-0003', requests: 52, status: 'Pending', joinDate: '2026-01-20' },
    { id: 4, name: 'Central Healthcare', email: 'info@centralhc.com', city: 'Houston', address: '321 Medical Dr', phone: '+1 (555) 100-0004', requests: 41, status: 'Verified', joinDate: '2022-06-22' },
    { id: 5, name: 'University Hospital', email: 'contact@univhosp.com', city: 'Phoenix', address: '654 Campus Rd', phone: '+1 (555) 100-0005', requests: 29, status: 'Verified', joinDate: '2023-02-18' },
    { id: 6, name: 'Community Medical', email: 'admin@commmed.com', city: 'Philadelphia', address: '987 Community St', phone: '+1 (555) 100-0006', requests: 12, status: 'Suspended', joinDate: '2023-08-30' },
  ];

  const stats = [
    { label: 'Total Hospitals', value: hospitals.length, emoji: '🏥', bg: 'stat-purple' },
    { label: 'Verified', value: hospitals.filter(h => h.status === 'Verified').length, emoji: '✅', bg: 'stat-green' },
    { label: 'Pending', value: hospitals.filter(h => h.status === 'Pending').length, emoji: '⏳', bg: 'stat-orange' },
    { label: 'Suspended', value: hospitals.filter(h => h.status === 'Suspended').length, emoji: '🚫', bg: 'stat-red' },
  ];

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || h.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Verified': return { bg: 'bg-green-100', text: 'text-green-700', emoji: '✅' };
      case 'Pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700', emoji: '⏳' };
      case 'Suspended': return { bg: 'bg-red-100', text: 'text-red-700', emoji: '🚫' };
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
            const sc = getStatusConfig(hospital.status);
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
                      {sc.emoji} {hospital.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{hospital.city} • {hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{hospital.phone}</span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-xl font-extrabold text-gray-900">{hospital.requests}</p>
                      <p className="text-xs text-gray-400">Requests</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Joined</p>
                      <p className="text-xs font-semibold text-gray-600">{new Date(hospital.joinDate).getFullYear()}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1.5">
                      {hospital.status === 'Pending' && (
                        <>
                          <button className="px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-all hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            ✅ Approve
                          </button>
                          <button className="px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-all hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' }}>
                            ❌ Reject
                          </button>
                        </>
                      )}
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
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
