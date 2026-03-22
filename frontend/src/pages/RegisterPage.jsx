import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Droplet, User, Mail, Lock, Phone, MapPin, Building2, AlertTriangle, CheckCircle, HeartHandshake, Shield, Key, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState('donor');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'requester') setUserType('requester');
  }, [searchParams]);

  const [formData, setFormData] = useState({
    name: '', age: '', email: '', password: '', phone: '', bloodGroup: 'A+', city: '', pincode: '', address: '', secretKey: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const userTypes = [
    { id: 'donor', emoji: '🩸', label: 'Donor', desc: 'Give blood, save lives', color: 'from-rose-500 to-pink-600' },
    { id: 'requester', emoji: '💊', label: 'Recipient/Patient', desc: 'Request blood units', color: 'from-orange-500 to-amber-600' },
    { id: 'hospital', emoji: '🏥', label: 'Hospital', desc: 'Manage blood supply', color: 'from-violet-500 to-purple-600' },
    { id: 'admin', emoji: '🔐', label: 'Admin', desc: 'System administration', color: 'from-blue-600 to-indigo-700' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    let url, payload;

    if (userType === 'admin') {
      url = '/api/admins/register/admin';
      payload = { email: formData.email, password: formData.password, secretKey: formData.secretKey };
    } else if (userType === 'donor') {
      url = '/api/donors/register/donor';
      payload = { name: formData.name, age: formData.age ? Number(formData.age) : undefined, email: formData.email, password: formData.password, phone: formData.phone, bloodGroup: formData.bloodGroup, city: formData.city, pincode: formData.pincode };
    } else if (userType === 'requester') {
      url = '/api/requesters/register';
      payload = { name: formData.name, age: formData.age ? Number(formData.age) : undefined, email: formData.email, password: formData.password, phone: formData.phone, address: formData.address, city: formData.city, pincode: formData.pincode, roleAlias: 'patient' };
    } else {
      url = '/api/hospitals/register';
      payload = { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, address: formData.address, city: formData.city, pincode: formData.pincode };
    }

    try {
      await axios.post(url, payload);
      setSuccess('Registration successful! Redirecting to login...');
      setFormData({ name: '', age: '', email: '', password: '', phone: '', bloodGroup: 'A+', city: '', pincode: '', address: '', secretKey: '' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = "w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-rose-400 bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="min-h-screen py-12 px-6" style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #f8f7ff 50%, #fff0fb 100%)' }}>
      {/* Background blobs */}
      <div className="fixed top-20 left-10 w-80 h-80 bg-rose-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-72 h-72 bg-violet-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100 relative">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' }}>
              <Droplet className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900">
              Life<span style={{ color: '#ff3b5c' }}>Flow</span>
            </span>
          </div>

          <div className="mb-7">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Create Account</h1>
            <p className="text-gray-500">Join our community and start saving lives</p>
          </div>

          {/* User Type Grid */}
          <div className="mb-7">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Register as</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {userTypes.map((type) => (
                <button key={type.id} type="button" onClick={() => setUserType(type.id)}
                  className={`relative py-4 px-2 rounded-2xl font-semibold text-sm transition-all ${
                    userType === type.id
                      ? 'text-white shadow-xl scale-105'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
                  }`}
                  style={userType === type.id ? {
                    background: `linear-gradient(135deg, ${type.color.replace('from-', '').replace(' to-', ', ')})`,
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  } : {}}>
                  <div className="text-2xl mb-1.5">{type.emoji}</div>
                  <div>{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Feedback */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-3.5 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 p-3.5 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-sm text-green-700 font-medium">{success}</p>
              </div>
            )}

            {/* Name */}
            {userType !== 'admin' && (
              <div>
                <label className={labelClass}>
                  {userType === 'donor' ? 'Full Name' : userType === 'requester' ? 'Organization/Full Name' : 'Hospital Name'}
                </label>
                <div className="relative">
                  {userType === 'hospital' ? <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> : <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    placeholder={userType === 'donor' ? 'John Doe' : userType === 'requester' ? 'Your Name or Organization' : 'City General Hospital'}
                    className={inputClass} required />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="you@example.com" className={inputClass} required />
              </div>
            </div>

            {/* Phone */}
            {userType !== 'admin' && (
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="+1 (555) 000-0000" className={inputClass} required />
                </div>
              </div>
            )}

            {/* Age */}
            {(userType === 'donor' || userType === 'requester') && (
              <div>
                <label className={labelClass}>Age</label>
                <div className="relative">
                  <input type="number" min="18" max="100" name="age" value={formData.age} onChange={handleChange}
                    placeholder="Enter age" className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-rose-400" />
                </div>
              </div>
            )}

            {/* Blood Group */}
            {userType === 'donor' && (
              <div>
                <label className={labelClass}>Blood Group</label>
                <div className="grid grid-cols-4 gap-2">
                  {bloodGroups.map((group) => (
                    <button key={group} type="button" onClick={() => setFormData({ ...formData, bloodGroup: group })}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                        formData.bloodGroup === group
                          ? 'text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={formData.bloodGroup === group ? {
                        background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)',
                        boxShadow: '0 4px 12px rgba(255,59,92,0.35)'
                      } : {}}>
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* City */}
            {userType !== 'admin' && (
              <div>
                <label className={labelClass}>City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="city" value={formData.city} onChange={handleChange}
                    placeholder="New York" className={inputClass} required />
                </div>
              </div>
            )}

            {/* Pincode */}
            {userType !== 'admin' && (
              <div>
                <label className={labelClass}>Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                  placeholder="123456" className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-rose-400" />
              </div>
            )}

            {/* Address */}
            {(userType === 'hospital' || userType === 'requester') && (
              <div>
                <label className={labelClass}>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange}
                  placeholder="Full address" rows="2"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-rose-400 resize-none" required />
              </div>
            )}

            {/* Secret Key */}
            {userType === 'admin' && (
              <div>
                <label className={labelClass}>Admin Secret Key</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" name="secretKey" value={formData.secretKey} onChange={handleChange}
                    placeholder="Enter admin secret key" className={inputClass} required />
                </div>
                <p className="text-xs text-gray-400 mt-1">Contact system administrator for the secret key</p>
              </div>
            )}

            {/* Password */}
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  placeholder="••••••••" className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-rose-400" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded accent-rose-500" required />
              <span className="text-sm text-gray-600">I agree to the <a href="#" className="font-semibold" style={{ color: '#ff3b5c' }}>Terms of Service</a> and <a href="#" className="font-semibold" style={{ color: '#ff3b5c' }}>Privacy Policy</a></span>
            </label>

            <button type="submit" disabled={loading}
              className="w-full py-4 text-white rounded-xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 shadow-xl"
              style={{
                background: loading ? '#ccc' : 'linear-gradient(135deg, #ff3b5c, #ff6b35)',
                boxShadow: loading ? 'none' : '0 8px 25px rgba(255, 59, 92, 0.4)'
              }}>
              {loading ? 'Creating Account...' : '🚀 Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold hover:underline" style={{ color: '#ff3b5c' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
