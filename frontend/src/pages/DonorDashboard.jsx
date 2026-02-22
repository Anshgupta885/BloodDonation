import React, { useState, useEffect } from 'react';
import { Droplet, MapPin, Activity, Calendar, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';

export default function DonorDashboard({ user, onLogout }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { setError('Authentication token not found.'); return; }
      const response = await axios.get('/api/donors/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
      setIsAvailable(response.data.donor.isAvailable);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAvailability = async () => {
    const originalAvailability = isAvailable;
    setIsAvailable(!isAvailable);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/donors/availability', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      setIsAvailable(originalAvailability);
      setError('Failed to update availability status.');
    }
  };

  const handleRespond = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/requests/${requestId}/respond`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh data after successful response
      fetchData();
      alert('Thank you for responding! The requester will be notified.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to respond to request.');
    }
  };

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case 'Critical': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500', emoji: '🚨' };
      case 'Urgent': return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', dot: 'bg-orange-500', emoji: '⚠️' };
      case 'Moderate': return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', dot: 'bg-yellow-500', emoji: '📋' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400', emoji: '📋' };
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-rose-100 border-t-rose-500 animate-spin" />
        <Droplet className="absolute inset-0 m-auto w-6 h-6 text-rose-500" />
      </div>
    </div>
  );

  if (error) return <div className="text-red-500 bg-red-50 rounded-2xl p-4 font-medium">{error}</div>;
  if (!dashboardData) return null;

  const { donor, stats, emergencyRequests } = dashboardData;

  const statItems = [
    { label: 'Total Donations', value: stats.totalDonations, emoji: '🩸', color: '#ff3b5c', bg: 'stat-red' },
    { label: 'Lives Saved', value: stats.livesSaved, emoji: '❤️', color: '#10b981', bg: 'stat-green' },
    { label: 'Last Donation', value: stats.lastDonation, emoji: '📅', color: '#3b82f6', bg: 'stat-blue' },
    { label: 'Next Eligible', value: stats.nextEligible, emoji: '✅', color: '#7c3aed', bg: 'stat-purple' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-1">👋 Welcome back</p>
          <h1 className="text-3xl font-extrabold text-gray-900">{donor.name}!</h1>
          <p className="text-gray-500 mt-1 text-sm">Here's your donation dashboard</p>
        </div>

        {/* Availability Toggle */}
        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all ${
          isAvailable ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        }`}>
          <span className="text-sm font-semibold text-gray-700">Status:</span>
          <button onClick={handleToggleAvailability}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all shadow-inner ${
              isAvailable ? 'bg-green-500' : 'bg-gray-300'
            }`}>
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
              isAvailable ? 'translate-x-8' : 'translate-x-1'
            }`} />
          </button>
          <span className={`text-sm font-bold ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
            {isAvailable ? '🟢 Active' : '⚫ Inactive'}
          </span>
        </div>
      </div>

      {/* Blood Group Hero Card */}
      <div className="rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl" style={{
        background: 'linear-gradient(135deg, #ff3b5c 0%, #ff6b35 50%, #ff3b5c 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 6s ease infinite',
        boxShadow: '0 20px 60px rgba(255,59,92,0.4)'
      }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-20 -translate-x-10" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-2">Your Blood Group</p>
            <h2 className="text-7xl font-extrabold mb-3">{donor.bloodGroup}</h2>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">Universal Donor</span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">⚡ High Demand</span>
            </div>
          </div>
          <Droplet className="w-28 h-28 text-white/15" fill="white" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <div key={index} className={`rounded-2xl p-6 card-lift cursor-default ${stat.bg}`}>
            <div className="text-3xl mb-4">{stat.emoji}</div>
            <p className="text-2xl font-extrabold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Emergency Requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl">🚨</div>
          <div>
            <h2 className="font-bold text-gray-900">Emergency Requests Near You</h2>
            <p className="text-xs text-gray-500">Patients urgently need your help</p>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {emergencyRequests.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No pending blood requests at the moment.</div>
          ) : (
            emergencyRequests.map((request) => {
              const urgencyConfig = getUrgencyConfig(request.urgency);
              return (
                <div key={request.id} className="p-5 hover:bg-gray-50/80 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{request.hospital}</h3>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${urgencyConfig.bg} ${urgencyConfig.text} ${urgencyConfig.border}`}>
                          {urgencyConfig.emoji} {request.urgency}
                        </span>
                        {request.requesterModel && (
                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                             {request.requesterModel}
                           </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Droplet className="w-4 h-4 text-rose-500" fill="currentColor" />
                          <strong className="text-gray-800">{request.bloodGroup}</strong>
                          <span>• {request.units} units needed</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {request.distance}
                        </span>
                        <span className="text-gray-400">{request.time}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRespond(request.id)}
                      className="px-6 py-2.5 text-white rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                      style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)', boxShadow: '0 6px 20px rgba(255,59,92,0.35)' }}>
                      Respond Now →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card-lift rounded-2xl p-6 text-white relative overflow-hidden shadow-xl"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 12px 35px rgba(59,130,246,0.35)' }}>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-2">Schedule Donation</h3>
          <p className="text-blue-100 text-sm mb-4">Book your next blood donation appointment</p>
          <button className="px-5 py-2.5 bg-white rounded-xl font-bold text-sm text-blue-600 hover:bg-blue-50 transition-colors">
            Book Now
          </button>
        </div>

        <div className="card-lift rounded-2xl p-6 text-white relative overflow-hidden shadow-xl"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 12px 35px rgba(124,58,237,0.35)' }}>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="text-4xl mb-4">🔗</div>
          <h3 className="text-xl font-bold mb-2">Refer a Friend</h3>
          <p className="text-purple-100 text-sm mb-4">Invite others to join the life-saving community</p>
          <button className="px-5 py-2.5 bg-white rounded-xl font-bold text-sm text-purple-600 hover:bg-purple-50 transition-colors">
            Share Link
          </button>
        </div>
      </div>
    </div>
  );
}
