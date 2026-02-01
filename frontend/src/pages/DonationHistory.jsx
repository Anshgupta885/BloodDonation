import React from 'react';
import { Calendar, MapPin, Building2, Droplet, Award, CheckCircle } from 'lucide-react';

export default function DonationHistory({ user, onLogout }) {
  const donations = [
    { id: 1, date: '2025-12-08', hospital: 'City General Hospital', location: 'New York, NY', units: 1, status: 'Completed', impact: '3 lives saved' },
    { id: 2, date: '2025-09-15', hospital: 'St. Mary Medical Center', location: 'New York, NY', units: 1, status: 'Completed', impact: '3 lives saved' },
    { id: 3, date: '2025-06-20', hospital: 'Memorial Hospital', location: 'New York, NY', units: 1, status: 'Completed', impact: '3 lives saved' },
    { id: 4, date: '2025-03-10', hospital: 'Central Healthcare', location: 'New York, NY', units: 1, status: 'Completed', impact: '3 lives saved' },
    { id: 5, date: '2024-12-05', hospital: 'City General Hospital', location: 'New York, NY', units: 1, status: 'Completed', impact: '3 lives saved' },
    { id: 6, date: '2024-09-18', hospital: 'University Hospital', location: 'New York, NY', units: 1, status: 'Completed', impact: '3 lives saved' },
  ];

  const stats = [
    { label: 'Total Donations', value: '12', icon: Droplet },
    { label: 'Total Units', value: '12', icon: Activity },
    { label: 'Lives Saved', value: '36', icon: Award },
    { label: 'Years Donating', value: '3', icon: Calendar },
  ];

  return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donation History</h1>
          <p className="text-gray-600 mt-1">Track your life-saving journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <Icon className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Achievement Banner */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <Award className="w-16 h-16 text-white" fill="white" />
            <div>
              <h2 className="text-2xl font-bold mb-1">Bronze Level Donor</h2>
              <p className="text-amber-100">You've made 12 donations! 3 more to reach Silver level.</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Donation Timeline</h2>
          
          <div className="space-y-6">
            {donations.map((donation, index) => (
              <div key={donation.id} className="relative">
                {/* Timeline Line */}
                {index < donations.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-full bg-gray-200"></div>
                )}
                
                <div className="flex gap-4">
                  {/* Timeline Dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-green-100 border-4 border-white shadow-md flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  
                  {/* Content Card */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900">{donation.hospital}</h3>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                            {donation.status}
                          </span>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(donation.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{donation.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Droplet className="w-4 h-4 text-red-600" />
                            <span>{donation.units} unit donated</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-600" />
                            <span className="text-amber-600 font-medium">{donation.impact}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium whitespace-nowrap">
                        View Certificate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Donation Reminder */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Ready for your next donation?</h3>
              <p className="text-blue-700 mb-3">You'll be eligible to donate again on January 23, 2026</p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

function Activity({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
