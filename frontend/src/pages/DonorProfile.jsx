import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { User, Mail, Phone, MapPin, Droplet, Calendar, Edit2, Save } from 'lucide-react';

export default function DonorProfile({ user, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bloodGroup: 'O+',
    city: 'New York',
    address: '123 Main Street, Apt 4B',
    dateOfBirth: '1990-05-15',
    weight: '75',
    lastDonation: '2025-12-08',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <DashboardLayout userType="donor" user={user} onLogout={onLogout}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information</p>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with Background */}
          <div className="h-32 bg-gradient-to-br from-red-500 to-red-600 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <User className="w-12 h-12 text-red-600" />
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{formData.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{formData.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{formData.phone}</span>
                  </div>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                {isEditing ? (
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  >
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl">
                    <Droplet className="w-5 h-5 text-red-600" fill="currentColor" />
                    <span className="text-red-600 font-medium">{formData.bloodGroup}</span>
                  </div>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{formData.city}</span>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{new Date(formData.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-900">{formData.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Donation Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Donation Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Donation Date
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{new Date(formData.lastDonation).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl">
                <span className="text-gray-900">{formData.weight} kg</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eligibility Status
              </label>
              <div className="px-4 py-3 bg-green-50 rounded-xl">
                <span className="text-green-600 font-medium">Eligible in 15 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
