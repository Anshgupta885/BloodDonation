import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Droplet, Users, FileText, Loader, Edit } from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

export default function RequesterDashboard({ user, onLogout }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [requesterData, setRequesterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) { setError('Authentication token not found.'); return; }
        const [dashRes, profRes] = await Promise.all([
          axios.get('/api/requesters/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setDashboardData(dashRes.data);
        setRequesterData(profRes.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case 'Critical': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', emoji: '🚨' };
      case 'Urgent': return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', emoji: '⚠️' };
      case 'Moderate': return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', emoji: '📋' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', emoji: '📋' };
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/requests/${requestId}`, { headers: { Authorization: `Bearer ${token}` } });
        setDashboardData(prev => ({
          ...prev,
          activeRequests: prev.activeRequests.filter(req => req._id !== requestId),
          stats: { ...prev.stats, activeRequests: prev.stats.activeRequests - 1 }
        }));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel request.');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
        <Loader className="absolute inset-0 m-auto w-6 h-6 text-orange-500" />
      </div>
    </div>
  );

  if (error) return <div className="text-red-500 bg-red-50 rounded-2xl p-4 font-medium">⚠️ {error}</div>;
  if (!dashboardData || !requesterData) return null;

  const { stats, activeRequests, fulfilledRequests } = dashboardData;
  const statItems = [
    { label: 'Active Requests', value: stats.activeRequests, emoji: '⏳', bg: 'stat-orange' },
    { label: 'Fulfilled Today', value: stats.fulfilledToday, emoji: '✅', bg: 'stat-green' },
    { label: 'Total Donors', value: stats.totalDonors, emoji: '👥', bg: 'stat-blue' },
    { label: 'Units Collected', value: stats.unitsCollected, emoji: '🩸', bg: 'stat-red' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">💊 Requester Portal</p>
          <h1 className="text-3xl font-extrabold text-gray-900">{requesterData.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your blood requests</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/dashboard/create-request"
            className="inline-flex items-center gap-2 px-5 py-3 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-lg text-sm"
            style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)', boxShadow: '0 6px 20px rgba(255,59,92,0.35)' }}>
            <FileText className="w-4 h-4" /> New Request
          </Link>
          <Link to="/dashboard/requester/update"
            className="inline-flex items-center gap-2 px-5 py-3 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-lg text-sm"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 6px 20px rgba(249,115,22,0.35)' }}>
            <Edit className="w-4 h-4" /> Update Details
          </Link>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-1.5" style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }} />
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-md"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
              {requesterData.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Requester Details</h2>
              <p className="text-xs text-gray-400">Your profile information</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              { emoji: '📧', label: 'Email', value: requesterData.email },
              { emoji: '📞', label: 'Phone', value: requesterData.phone },
              { emoji: '📍', label: 'City', value: requesterData.city },
              { emoji: '🏠', label: 'Address', value: requesterData.address },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{item.emoji} {item.label}</p>
                <p className="font-semibold text-gray-900 text-xs truncate">{item.value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, i) => (
          <div key={i} className={`rounded-2xl p-6 card-lift cursor-default ${stat.bg}`}>
            <div className="text-3xl mb-4">{stat.emoji}</div>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Active Requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl">⏳</div>
            <div>
              <h2 className="font-bold text-gray-900">Active Blood Requests</h2>
              <p className="text-xs text-gray-500">Pending donor responses</p>
            </div>
          </div>
          <Link to="/request-status" className="text-sm font-semibold hover:underline" style={{ color: '#ff3b5c' }}>View All →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {activeRequests.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-gray-500 font-medium">No active requests</p>
            </div>
          ) : activeRequests.map((request) => {
            const uc = getUrgencyConfig(request.urgency);
            return (
              <div key={request._id} className="p-5 hover:bg-gray-50/80 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Droplet className="w-5 h-5 text-rose-500" fill="currentColor" />
                        <span className="font-bold text-gray-900 text-lg">{request.bloodGroup}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${uc.bg} ${uc.text} ${uc.border}`}>
                        {uc.emoji} {request.urgency}
                      </span>
                      <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(request.createdAt))} ago</span>
                    </div>
                    <p className="text-sm text-gray-500">{request.units} units needed</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors">View Responses</button>
                    <button onClick={() => handleDeleteRequest(request._id)}
                      className="px-4 py-2 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors border border-red-200">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fulfilled Requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">✅</div>
          <div>
            <h2 className="font-bold text-gray-900">Recently Fulfilled</h2>
            <p className="text-xs text-gray-500">Completed donations</p>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {fulfilledRequests.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-gray-500 font-medium">No fulfilled requests yet</p>
            </div>
          ) : fulfilledRequests.map((request) => (
            <div key={request._id} className="p-5 hover:bg-gray-50/80 transition-colors flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">✅</div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-900">{request.bloodGroup}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{request.units} units</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    By <span className="font-semibold text-gray-800">{request.donor?.name || 'N/A'}</span> • {formatDistanceToNow(new Date(request.updatedAt))} ago
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors whitespace-nowrap">
                📄 Report
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
