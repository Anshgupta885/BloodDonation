import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { Clock, CheckCircle, XCircle, AlertCircle, Droplet, Calendar, Users } from 'lucide-react';

export default function RequestStatus({ user: propUser, onLogout }) {
  const location = useLocation();
  const user = propUser || location.state?.user;
  const userType = user?.type || 'hospital';
  const [activeTab, setActiveTab] = useState('all');

  const requests = [
    {
      id: 1,
      bloodGroup: 'O+',
      units: 2,
      urgency: 'Critical',
      status: 'Active',
      createdAt: '2026-01-23',
      requiredBy: '2026-01-24',
      patientName: 'Alice Johnson',
      responses: 5,
      fulfilled: 0,
    },
    {
      id: 2,
      bloodGroup: 'A-',
      units: 1,
      urgency: 'Urgent',
      status: 'Active',
      createdAt: '2026-01-22',
      requiredBy: '2026-01-25',
      patientName: 'Bob Smith',
      responses: 3,
      fulfilled: 0,
    },
    {
      id: 3,
      bloodGroup: 'AB+',
      units: 1,
      urgency: 'Moderate',
      status: 'Fulfilled',
      createdAt: '2026-01-20',
      requiredBy: '2026-01-23',
      patientName: 'Carol Williams',
      responses: 2,
      fulfilled: 1,
      donorName: 'John Doe',
    },
    {
      id: 4,
      bloodGroup: 'B+',
      units: 3,
      urgency: 'Moderate',
      status: 'Cancelled',
      createdAt: '2026-01-19',
      requiredBy: '2026-01-22',
      patientName: 'David Brown',
      responses: 0,
      fulfilled: 0,
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Requests', count: requests.length },
    { id: 'active', label: 'Active', count: requests.filter(r => r.status === 'Active').length },
    { id: 'fulfilled', label: 'Fulfilled', count: requests.filter(r => r.status === 'Fulfilled').length },
    { id: 'cancelled', label: 'Cancelled', count: requests.filter(r => r.status === 'Cancelled').length },
  ];

  const filteredRequests = activeTab === 'all' 
    ? requests 
    : requests.filter(r => r.status.toLowerCase() === activeTab);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Active':
        return { icon: Clock, color: 'blue', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
      case 'Fulfilled':
        return { icon: CheckCircle, color: 'green', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
      case 'Cancelled':
        return { icon: XCircle, color: 'gray', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
      default:
        return { icon: AlertCircle, color: 'gray', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
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

    return (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Request Status</h1>
            <p className="text-gray-600 mt-1">Track and manage your blood requests</p>
          </div>
  
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-red-700'
                      : 'bg-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
  
          {/* Request Progress Tracker (for active requests) */}
          {activeTab === 'active' && (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <h2 className="text-xl font-bold mb-4">Active Requests Summary</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Clock className="w-8 h-8 mb-2" />
                  <p className="text-2xl font-bold mb-1">
                    {requests.filter(r => r.status === 'Active').length}
                  </p>
                  <p className="text-blue-100 text-sm">Pending Requests</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Users className="w-8 h-8 mb-2" />
                  <p className="text-2xl font-bold mb-1">
                    {requests.filter(r => r.status === 'Active').reduce((sum, r) => sum + r.responses, 0)}
                  </p>
                  <p className="text-blue-100 text-sm">Total Responses</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-2xl font-bold mb-1">
                    {requests.filter(r => r.status === 'Active' && r.urgency === 'Critical').length}
                  </p>
                  <p className="text-blue-100 text-sm">Critical Cases</p>
                </div>
              </div>
            </div>
          )}
  
          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div key={request.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} flex items-center gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {request.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency}
                          </span>
                          <span className="text-sm text-gray-500">Request #{request.id}</span>
                        </div>
                        
                        {/* Details Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Blood Group & Units</p>
                            <div className="flex items-center gap-2">
                              <Droplet className="w-4 h-4 text-red-600" fill="currentColor" />
                              <span className="font-medium text-gray-900">{request.bloodGroup}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">{request.units} units</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Patient Name</p>
                            <p className="font-medium text-gray-900">{request.patientName}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Created Date</p>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Required By</p>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(request.requiredBy).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Responses</p>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-600">{request.responses} donors</span>
                            </div>
                          </div>
                          
                          {request.status === 'Fulfilled' && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Donor</p>
                              <p className="font-medium text-green-600">{request.donorName}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Progress Bar (for active requests) */}
                        {request.status === 'Active' && (
                          <div>
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                              <span>Progress: {request.fulfilled}/{request.units} units fulfilled</span>
                              <span>{Math.round((request.fulfilled / request.units) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-600 transition-all"
                                style={{ width: `${(request.fulfilled / request.units) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex lg:flex-col gap-2">
                        {request.status === 'Active' && (
                          <>
                            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
                              View Responses
                            </button>
                            <button className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium whitespace-nowrap">
                              Cancel
                            </button>
                          </>
                        )}
                        {request.status === 'Fulfilled' && (
                          <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium whitespace-nowrap">
                              Download Report
                            </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600">You don't have any {activeTab === 'all' ? '' : activeTab} requests yet.</p>
              </div>
            )}
          </div>
        </div>
    );}
