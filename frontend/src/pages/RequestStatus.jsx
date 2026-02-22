import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle, Droplet, Calendar, Users, Loader } from 'lucide-react';
import axios from 'axios';

export default function RequestStatus({ user: propUser, onLogout }) {
  const location = useLocation();
  const user = propUser || location.state?.user;
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');
        const response = await fetch('http://localhost:5000/api/requests/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRequests(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (user && (user.type === 'requester' || user.type === 'hospital')) {
      fetchRequests();
    } else {
      setLoading(false);
      setError('User not authorized to view this page.');
    }
  }, [user]);

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/requests/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(prev => prev.filter(req => req._id !== requestId));
        setSuccessMessage('Request cancelled successfully!');
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel request.');
        setSuccessMessage('');
      }
    }
  };

  const tabs = [
    { id: 'all', label: 'All', emoji: '📋', count: requests.length },
    { id: 'active', label: 'Active', emoji: '⏳', count: requests.filter(r => r.status === 'Active').length },
    { id: 'fulfilled', label: 'Fulfilled', emoji: '✅', count: requests.filter(r => r.status === 'Fulfilled').length },
    { id: 'cancelled', label: 'Cancelled', emoji: '❌', count: requests.filter(r => r.status === 'Cancelled').length },
  ];

  const filteredRequests = activeTab === 'all' ? requests : requests.filter(r => r.status.toLowerCase() === activeTab);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Active': return { emoji: '⏳', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', bar: '#3b82f6' };
      case 'Fulfilled': return { emoji: '✅', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', bar: '#10b981' };
      case 'Cancelled': return { emoji: '❌', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', bar: '#9ca3af' };
      default: return { emoji: '📋', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', bar: '#9ca3af' };
    }
  };

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case 'Critical': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', emoji: '🚨' };
      case 'Urgent': return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', emoji: '⚠️' };
      case 'Moderate': return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', emoji: '📋' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', emoji: '📋' };
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

  if (error) return (
    <div className="flex items-center gap-4 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl font-medium">
      <AlertCircle className="w-6 h-6 flex-shrink-0" />
      {error}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Request <span style={{ color: '#ff3b5c' }}>Status</span>
        </h1>
        <p className="text-gray-500 mt-1">Track and manage your blood requests</p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl font-medium">
          <span>✅</span> {successMessage}
        </div>
      )}

      {/* Tab Pills */}
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? 'text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            style={activeTab === tab.id ? {
              background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)',
              boxShadow: '0 6px 20px rgba(255,59,92,0.35)'
            } : {}}>
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
              activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100 text-gray-600'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Active Summary Banner */}
      {activeTab === 'active' && requests.filter(r => r.status === 'Active').length > 0 && (
        <div className="rounded-2xl p-6 text-white shadow-xl"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 12px 35px rgba(59,130,246,0.35)' }}>
          <h2 className="text-xl font-bold mb-4">Active Requests Summary</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { emoji: '⏳', value: requests.filter(r => r.status === 'Active').length, label: 'Pending Requests' },
              { emoji: '👥', value: requests.filter(r => r.status === 'Active').reduce((s, r) => s + (r.responses?.length || 0), 0), label: 'Total Responses' },
              { emoji: '🚨', value: requests.filter(r => r.status === 'Active' && r.urgency === 'Critical').length, label: 'Critical Cases' },
            ].map((item, i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="text-2xl font-extrabold mb-1">{item.value}</p>
                <p className="text-blue-100 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Cards */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? filteredRequests.map((request) => {
          const sc = getStatusConfig(request.status);
          const uc = getUrgencyConfig(request.urgency);
          const progressPct = request.units > 0 ? Math.round(((request.fulfilledUnits || 0) / request.units) * 100) : 0;

          return (
            <div key={request._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all overflow-hidden">
              {/* Top color bar by status */}
              <div className="h-1" style={{ background: sc.bar }} />
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    {/* Status + Urgency badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                        {sc.emoji} {request.status}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border ${uc.bg} ${uc.text} ${uc.border}`}>
                        {uc.emoji} {request.urgency}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">#{request._id?.slice(-8)}</span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-sm">🩸</div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Blood & Units</p>
                          <p className="font-bold text-gray-900">{request.bloodGroup} <span className="text-gray-500 font-normal text-sm">• {request.units} units</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm">👤</div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Patient</p>
                          <p className="font-bold text-gray-900">{request.patientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-sm">📅</div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Created</p>
                          <p className="font-bold text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-sm">⏰</div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Required By</p>
                          <p className="font-bold text-gray-900">{new Date(request.byDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-sm">👥</div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Responses</p>
                          <p className="font-bold text-violet-600">{request.responses?.length || 0} donors</p>
                        </div>
                      </div>
                      {request.status === 'Fulfilled' && request.donorName && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-sm">✅</div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium">Donor</p>
                            <p className="font-bold text-green-600">{request.donorName}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {request.status === 'Active' && (
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                          <span className="font-semibold">Fulfillment Progress</span>
                          <span className="font-bold" style={{ color: '#ff3b5c' }}>{progressPct}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${progressPct}%`, background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{request.fulfilledUnits || 0} of {request.units} units fulfilled</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-2 flex-shrink-0">
                    {request.status === 'Active' && (
                      <>
                        <button className="px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all hover:scale-105 shadow-md whitespace-nowrap"
                          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 4px 12px rgba(59,130,246,0.35)' }}>
                          View Responses
                        </button>
                        <button onClick={() => handleDeleteRequest(request._id)}
                          className="px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-200 whitespace-nowrap">
                          Cancel Request
                        </button>
                      </>
                    )}
                    {request.status === 'Fulfilled' && (
                      <button className="px-4 py-2.5 text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors whitespace-nowrap">
                        📄 Download Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-500">You don't have any {activeTab === 'all' ? '' : activeTab} requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
