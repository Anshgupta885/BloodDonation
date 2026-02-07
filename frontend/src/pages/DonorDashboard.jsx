import React, { useState, useEffect } from 'react';
import { Droplet, MapPin, Activity, Calendar, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';

export default function DonorDashboard({ user, onLogout }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
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
    fetchData();
  }, []);

  const handleToggleAvailability = async () => {
    const originalAvailability = isAvailable;
    setIsAvailable(!isAvailable); // Optimistic update
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/donors/availability', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      setIsAvailable(originalAvailability); // Revert on failure
      setError('Failed to update availability status.');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'Urgent': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  if (!dashboardData) return null;

  const { donor, stats, emergencyRequests } = dashboardData;

  const statItems = [
    { label: 'Total Donations', value: stats.totalDonations, icon: Droplet, color: 'red' },
    { label: 'Lives Saved', value: stats.livesSaved, icon: Activity, color: 'green' },
    { label: 'Last Donation', value: stats.lastDonation, icon: Calendar, color: 'blue' },
    { label: 'Next Eligible', value: stats.nextEligible, icon: CheckCircle, color: 'purple' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {donor.name}!</h1>
          <p className="text-gray-600 mt-1">Here's your donation dashboard</p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Availability Status:</span>
            <button
              onClick={handleToggleAvailability}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                isAvailable ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isAvailable ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
              {isAvailable ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 mb-1">Your Blood Group</p>
            <h2 className="text-5xl font-bold">{donor.bloodGroup}</h2>
            <p className="text-red-100 mt-2">Universal Donor - High Demand</p>
          </div>
          <Droplet className="w-24 h-24 text-white opacity-20" fill="white" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Emergency Requests Near You</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">Patients need your help urgently</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {emergencyRequests.map((request) => (
            <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{request.hospital}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Droplet className="w-4 h-4 text-red-600" fill="currentColor" />
                      <span className="font-medium">{request.bloodGroup}</span>
                      <span className="text-gray-400">•</span>
                      <span>{request.units} units needed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{request.distance} away</span>
                    </div>
                    <span className="text-gray-400">{request.time}</span>
                  </div>
                </div>
                
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium whitespace-nowrap">
                  Respond Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-xl font-bold mb-2">Schedule Donation</h3>
          <p className="text-blue-100 mb-4">Book your next blood donation appointment</p>
          <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Book Now
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-xl font-bold mb-2">Refer a Friend</h3>
          <p className="text-purple-100 mb-4">Invite others to join the life-saving community</p>
          <button className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
            Share Link
          </button>
        </div>
      </div>
    </div>
  );
}
