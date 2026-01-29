import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { AlertTriangle, CheckCircle, Clock, Droplet, Users, FileText, TrendingUp } from 'lucide-react';

export default function HospitalDashboard() {
  const activeRequests = [
    { id: 1, bloodGroup: 'O+', units: 2, urgency: 'Critical', createdAt: '2 hours ago', responses: 5 },
    { id: 2, bloodGroup: 'A-', units: 1, urgency: 'Urgent', createdAt: '5 hours ago', responses: 3 },
    { id: 3, bloodGroup: 'B+', units: 3, urgency: 'Moderate', createdAt: '1 day ago', responses: 8 },
  ];

  const fulfilledRequests = [
    { id: 4, bloodGroup: 'AB+', units: 1, donor: 'John Doe', completedAt: '2 days ago' },
    { id: 5, bloodGroup: 'O-', units: 2, donor: 'Jane Smith', completedAt: '3 days ago' },
  ];

  const stats = [
    { label: 'Active Requests', value: '8', icon: Clock, color: 'orange', trend: '+2' },
    { label: 'Fulfilled Today', value: '12', icon: CheckCircle, color: 'green', trend: '+4' },
    { label: 'Total Donors', value: '156', icon: Users, color: 'blue', trend: '+15' },
    { label: 'Units Collected', value: '342', icon: Droplet, color: 'red', trend: '+23' },
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'Urgent': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage blood requests and inventory</p>
        </div>
        
        <Link
          to="/dashboard/create-request"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-lg shadow-red-500/25"
        >
          <FileText className="w-5 h-5" />
          Create New Request
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Urgency Alert */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-red-900 mb-1">Critical Blood Shortage Alert</h3>
            <p className="text-red-700">You have 3 critical requests pending. Consider increasing outreach to donors.</p>
          </div>
        </div>
      </div>

      {/* Active Requests */}
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
            <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
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
                    <span className="text-sm text-gray-500">• {request.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{request.units} units needed</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium">{request.responses} donors responded</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                    View Responses
                  </button>
                  <button className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium">
                    Cancel Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fulfilled Requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recently Fulfilled</h2>
          <p className="text-sm text-gray-600 mt-1">Completed donations</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {fulfilledRequests.map((request) => (
            <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
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
                      Donated by <span className="font-medium">{request.donor}</span> • {request.completedAt}
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

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/search"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <Users className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-bold mb-2">Search Donors</h3>
          <p className="text-blue-100">Find donors by blood group and location</p>
        </Link>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <FileText className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-bold mb-2">Generate Reports</h3>
          <p className="text-purple-100">Download monthly blood collection reports</p>
        </div>
      </div>
    </div>
  );
}