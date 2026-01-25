import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Droplet, User, Mail, Lock, Phone, MapPin, Building2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('donor');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bloodGroup: 'A+',
    city: '',
    hospitalName: '',
    address: '',
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock registration - redirect to login
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Droplet className="w-7 h-7 text-white" fill="white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">LifeFlow</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join our community and start saving lives</p>
          </div>

          {/* User Type Toggle */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Register As
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUserType('donor')}
                className={`px-6 py-4 rounded-xl font-medium transition-all ${
                  userType === 'donor'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <User className="w-5 h-5 mx-auto mb-2" />
                Blood Donor
              </button>
              <button
                type="button"
                onClick={() => setUserType('hospital')}
                className={`px-6 py-4 rounded-xl font-medium transition-all ${
                  userType === 'hospital'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Building2 className="w-5 h-5 mx-auto mb-2" />
                Hospital
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {userType === 'donor' ? 'Full Name' : 'Hospital Name'}
              </label>
              <div className="relative">
                {userType === 'donor' ? (
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                ) : (
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                )}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={userType === 'donor' ? 'John Doe' : 'City General Hospital'}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Blood Group (Donor Only) */}
            {userType === 'donor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            )}

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Address (Hospital Only) */}
            {userType === 'hospital' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full hospital address"
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                  required
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-1 text-red-600 border-gray-300 rounded focus:ring-red-500" required />
              <span className="text-sm text-gray-600">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}