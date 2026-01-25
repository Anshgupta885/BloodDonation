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
    { label: 'Total Hospitals', value: hospitals.length },
    { label: 'Verified', value: hospitals.filter(h => h.status === 'Verified').length },
    { label: 'Pending', value: hospitals.filter(h => h.status === 'Pending').length },
    { label: 'Suspended', value: hospitals.filter(h => h.status === 'Suspended').length },
  ];

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hospital.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hospital.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || hospital.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Verified':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle };
      case 'Pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock };
      case 'Suspended':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: XCircle };
    }
  };

  return (
    <DashboardLayout userType="admin" user={user} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Hospitals</h1>
            <p className="text-gray-600 mt-1">View and manage all registered hospitals</p>
          </div>
          
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium">
            <Download className="w-5 h-5" />
            Export Data
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or city..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hospitals Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requests
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHospitals.map((hospital) => {
                  const statusConfig = getStatusConfig(hospital.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={hospital.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{hospital.name}</p>
                            <p className="text-sm text-gray-500">{hospital.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <p>{hospital.city}</p>
                            <p className="text-sm text-gray-500">{hospital.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{hospital.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="truncate max-w-[150px]">{hospital.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{hospital.requests}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {hospital.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {hospital.status === 'Pending' && (
                            <>
                              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                                Approve
                              </button>
                              <button className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                                Reject
                              </button>
                            </>
                          )}
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredHospitals.length === 0 && (
            <div className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hospitals found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredHospitals.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredHospitals.length} of {hospitals.length} hospitals
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                  Previous
                </button>
                <button className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium">
                  1
                </button>
                <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                  2
                </button>
                <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
