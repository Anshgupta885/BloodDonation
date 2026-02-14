import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Clock, Droplet, Users, FileText, TrendingUp, Loader, Edit } from 'lucide-react';
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
        if (!token) {
          setError('Authentication token not found.');
          return;
        }
        const [dashboardResponse, profileResponse] = await Promise.all([
          axios.get('/api/requesters/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setDashboardData(dashboardResponse.data);
        setRequesterData(profileResponse.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'Urgent': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found.');
          return;
        }

        await axios.delete(`http://localhost:5000/api/requests/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update dashboard data to remove the deleted request
        setDashboardData(prevData => ({
          ...prevData,
          activeRequests: prevData.activeRequests.filter(req => req._id !== requestId),
          stats: {
            ...prevData.stats,
            activeRequests: prevData.stats.activeRequests - 1,
          }
        }));
        // Optionally show a success message
        // setSuccess('Request cancelled successfully.');

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel request.');
      }
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-full">
          <Loader className="w-12 h-12 animate-spin text-red-600" />
        </div>
    );
  }

  if (error) {
    return (
        <div className="text-red-600">{error}</div>
    );
  }

  if (!dashboardData || !requesterData) return null;

  const { stats, activeRequests, fulfilledRequests } = dashboardData;
  const statItems = [
    { label: 'Active Requests', value: stats.activeRequests, icon: Clock, color: 'orange' },
    { label: 'Fulfilled Today', value: stats.fulfilledToday, icon: CheckCircle, color: 'green' },
    { label: 'Total Donors', value: stats.totalDonors, icon: Users, color: 'blue' },
    { label: 'Units Collected', value: stats.unitsCollected, icon: Droplet, color: 'red' },
  ];

  return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{requesterData.name}</h1>
            <p className="text-gray-600 mt-1">Manage your blood requests and details</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/dashboard/create-request"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-lg shadow-red-500/25"
            >
              <FileText className="w-5 h-5" />
              Create New Request
            </Link>
            <Link
              to="/dashboard/requester/update"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/25"
            >
              <Edit className="w-5 h-5" />
              Update Details
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Requester Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Email:</strong> {requesterData.email}</div>
            <div><strong>Phone:</strong> {requesterData.phone}</div>
            <div><strong>City:</strong> {requesterData.city}</div>
            <div><strong>Address:</strong> {requesterData.address}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Active Blood Requests</h2>
              <p className="text-sm text-gray-600 mt-1">Currently pending donor responses</p>
            </div>
            <Link
              to="/request-status"
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {activeRequests.map((request) => (
              <div key={request._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Droplet className="w-5 h-5 text-red-600" fill="currentColor" />
                        <span className="font-medium text-gray-900 text-lg">{request.bloodGroup}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                      <span className="text-sm text-gray-500">• {formatDistanceToNow(new Date(request.createdAt))} ago</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{request.units} units needed</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                      View Responses
                    </button>
                    <button 
                        onClick={() => handleDeleteRequest(request._id)}
                        className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
                    >
                      Cancel Request
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recently Fulfilled</h2>
            <p className="text-sm text-gray-600 mt-1">Completed donations</p>
          </div>
          <div className="divide-y divide-gray-200">
            {fulfilledRequests.map((request) => (
              <div key={request._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{request.bloodGroup}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{request.units} units</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Donated by <span className="font-medium">{request.donor?.name || 'N/A'}</span> • {formatDistanceToNow(new Date(request.updatedAt))} ago
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                    Download Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}
