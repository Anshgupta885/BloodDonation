import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Droplet, User, Mail, Lock, Phone, MapPin, Building2, AlertTriangle, CheckCircle, HeartHandshake, Shield, Key } from 'lucide-react';
import axios from 'axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState('donor');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'requester') {
      setUserType('requester');
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bloodGroup: 'A+',
    city: '',
    address: '',
    secretKey: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    let url;
    let payload;

    if (userType === 'admin') {
      url = '/api/admins/register/admin';
      payload = {
        email: formData.email,
        password: formData.password,
        secretKey: formData.secretKey,
      };
    } else if (userType === 'donor') {
      url = '/api/donors/register/donor';
      payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        bloodGroup: formData.bloodGroup,
        city: formData.city,
      };
    } else if (userType === 'requester') {
      url = '/api/requesters/register';
      payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
      };
    } else { // hospital
      url = '/api/hospitals/register';
      payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
      };
    }

    try {
      await axios.post(url, payload);
      setSuccess('Registration successful! Redirecting to login...');
      setFormData({
        name: '', email: '', password: '', phone: '', bloodGroup: 'A+', city: '', address: '', secretKey: '',
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setUserType('donor')}
                className={`px-3 py-4 rounded-xl font-medium transition-all text-sm ${
                  userType === 'donor'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <User className="w-5 h-5 mx-auto mb-2" />
                Donor
              </button>
              <button
                type="button"
                onClick={() => setUserType('requester')}
                className={`px-3 py-4 rounded-xl font-medium transition-all text-sm ${
                  userType === 'requester'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <HeartHandshake className="w-5 h-5 mx-auto mb-2" />
                Requester
              </button>
              <button
                type="button"
                onClick={() => setUserType('hospital')}
                className={`px-3 py-4 rounded-xl font-medium transition-all text-sm ${
                  userType === 'hospital'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Building2 className="w-5 h-5 mx-auto mb-2" />
                Hospital
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`px-3 py-4 rounded-xl font-medium transition-all text-sm ${
                  userType === 'admin'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Shield className="w-5 h-5 mx-auto mb-2" />
                Admin
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Feedback Messages */}
            {error && (
              <div className="flex items-center gap-3 bg-red-100 p-3 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-3 bg-green-100 p-3 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}
            
            {/* Name */}
            {userType !== 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {userType === 'donor' ? 'Full Name' : userType === 'requester' ? 'Organization/Full Name' : 'Hospital Name'}
              </label>
              <div className="relative">
                {userType === 'donor' ? (
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                ) : userType === 'requester' ? (
                  <HeartHandshake className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                ) : (
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                )}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={userType === 'donor' ? 'John Doe' : userType === 'requester' ? 'Your Name or Organization' : 'City General Hospital'}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>
            )}

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

            {/* Phone (not for admin) */}
            {userType !== 'admin' && (
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
            )}

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

            {/* City (not for admin) */}
            {userType !== 'admin' && (
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
            )}

            {/* Address (Hospital/Requester Only) */}
            {(userType === 'hospital' || userType === 'requester') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={userType === 'requester' ? 'Your address' : 'Full hospital address'}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                  required
                />
              </div>
            )}

            {/* Secret Key (Admin Only) */}
            {userType === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Secret Key
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="secretKey"
                    value={formData.secretKey}
                    onChange={handleChange}
                    placeholder="Enter admin secret key"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Contact system administrator for the secret key</p>
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
              disabled={loading}
              className="w-full py-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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