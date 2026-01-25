import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { Search, Filter, Download, MoreVertical, CheckCircle, XCircle, User, Droplet, MapPin, Phone } from 'lucide-react';

export default function ManageDonors({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const donors = [
    { id: 1, name: 'John Doe', email: 'john@example.com', bloodGroup: 'O+', city: 'New York', phone: '+1 (555) 123-4567', donations: 12, status: 'Active', joinDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', bloodGroup: 'A+', city: 'Los Angeles', phone: '+1 (555) 234-5678', donations: 8, status: 'Active', joinDate: '2023-03-22' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', bloodGroup: 'B+', city: 'Chicago', phone: '+1 (555) 345-6789', donations: 15, status: 'Inactive', joinDate: '2022-11-10' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', bloodGroup: 'O-', city: 'Houston', phone: '+1 (555) 456-7890', donations: 20, status: 'Active', joinDate: '2022-08-05' },
    { id: 5, name: 'David Brown', email: 'david@example.com', bloodGroup: 'AB+', city: 'Phoenix', phone: '+1 (555) 567-8901', donations: 5, status: 'Active', joinDate: '2024-02-18' },
    { id: 6, name: 'Emily Davis', email: 'emily@example.com', bloodGroup: 'A-', city: 'Philadelphia', phone: '+1 (555) 678-9012', donations: 10, status: 'Suspended', joinDate: '2023-06-30' },
  ];

  const stats = [
    { label: 'Total Donors', value: donors.length },
    { label: 'Active', value: donors.filter(d => d.status === 'Active').length },
    { label: 'Inactive', value: donors.filter(d => d.status === 'Inactive').length },
    { label: 'Suspended', value: donors.filter(d => d.status === 'Suspended').length },
  ];

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          donor.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || donor.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Active':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle };
      case 'Inactive':
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: XCircle };
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Donors</h1>
            <p className="text-gray-600 mt-1">View and manage all registered donors</p>
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
                placeholder="Search by name, email, or blood group..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Donors Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donations
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
                {filteredDonors.map((donor) => {
                  const statusConfig = getStatusConfig(donor.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{donor.name}</p>
                            <p className="text-sm text-gray-500">{donor.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Droplet className="w-4 h-4 text-red-600" fill="currentColor" />
                          <span className="font-medium text-red-600">{donor.bloodGroup}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{donor.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{donor.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{donor.donations}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {donor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredDonors.length === 0 && (
            <div className="p-12 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No donors found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredDonors.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredDonors.length} of {donors.length} donors
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
