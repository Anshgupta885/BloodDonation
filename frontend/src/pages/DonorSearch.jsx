import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { Search, MapPin, Droplet, Phone, Mail, Filter, User } from 'lucide-react';

export default function DonorSearch({ user, onLogout }) {
  const [filters, setFilters] = useState({
    bloodGroup: 'all',
    city: '',
    availability: 'all',
  });

  const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const donors = [
    { id: 1, name: 'John Doe', bloodGroup: 'O+', city: 'New York', phone: '+1 (555) 123-4567', email: 'john@example.com', lastDonation: '45 days ago', available: true },
    { id: 2, name: 'Jane Smith', bloodGroup: 'A+', city: 'New York', phone: '+1 (555) 234-5678', email: 'jane@example.com', lastDonation: '60 days ago', available: true },
    { id: 3, name: 'Mike Johnson', bloodGroup: 'B+', city: 'New York', phone: '+1 (555) 345-6789', email: 'mike@example.com', lastDonation: '30 days ago', available: false },
    { id: 4, name: 'Sarah Williams', bloodGroup: 'O-', city: 'New York', phone: '+1 (555) 456-7890', email: 'sarah@example.com', lastDonation: '90 days ago', available: true },
    { id: 5, name: 'David Brown', bloodGroup: 'AB+', city: 'Brooklyn', phone: '+1 (555) 567-8901', email: 'david@example.com', lastDonation: '75 days ago', available: true },
    { id: 6, name: 'Emily Davis', bloodGroup: 'A-', city: 'Queens', phone: '+1 (555) 678-9012', email: 'emily@example.com', lastDonation: '50 days ago', available: true },
  ];

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredDonors = donors.filter(donor => {
    const matchesBloodGroup = filters.bloodGroup === 'all' || donor.bloodGroup === filters.bloodGroup;
    const matchesCity = !filters.city || donor.city.toLowerCase().includes(filters.city.toLowerCase());
    const matchesAvailability = filters.availability === 'all' || 
      (filters.availability === 'available' && donor.available) ||
      (filters.availability === 'unavailable' && !donor.available);
    
    return matchesBloodGroup && matchesCity && matchesAvailability;
  });

  return (
    <DashboardLayout userType="hospital" user={user} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search Donors</h1>
          <p className="text-gray-600 mt-1">Find available blood donors in your area</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 sticky top-24">
              <div className="flex items-center gap-2 text-gray-900">
                <Filter className="w-5 h-5" />
                <h2 className="font-bold">Filters</h2>
              </div>

              {/* Blood Group Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={filters.bloodGroup}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                >
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group === 'all' ? 'All Blood Groups' : group}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    placeholder="Enter city"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  name="availability"
                  value={filters.availability}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="all">All Donors</option>
                  <option value="available">Available Only</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({ bloodGroup: 'all', city: '', availability: 'all' })}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Donors List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Results Count */}
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 font-medium">
                  {filteredDonors.length} donor{filteredDonors.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            {/* Donor Cards */}
            {filteredDonors.length > 0 ? (
              <div className="space-y-4">
                {filteredDonors.map((donor) => (
                  <div key={donor.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-xl bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        
                        {/* Donor Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-gray-900 text-lg">{donor.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              donor.available 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {donor.available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          
                          <div className="grid sm:grid-cols-2 gap-2 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Droplet className="w-4 h-4 text-red-600" fill="currentColor" />
                              <span className="font-medium text-red-600">{donor.bloodGroup}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{donor.city}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{donor.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{donor.email}</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-2">
                            Last donation: {donor.lastDonation}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <button 
                        className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                          donor.available
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!donor.available}
                      >
                        Contact Donor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No donors found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
