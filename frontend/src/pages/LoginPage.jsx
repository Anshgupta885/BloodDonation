import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, Mail, Lock, ArrowRight, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'donor',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const userTypes = [
    { id: 'donor', emoji: '🩸', label: 'Donor' },
    { id: 'requester', emoji: '💊', label: 'Recipient/Patient' },
    { id: 'hospital', emoji: '🏥', label: 'Hospital' },
    { id: 'admin', emoji: '🔐', label: 'Admin' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password, userType } = formData;
    let url;
    if (userType === 'requester') {
      url = '/api/requesters/login';
    } else {
      const routePrefix = userType === 'donor' ? 'donors' : userType === 'hospital' ? 'hospitals' : 'admins';
      url = `/api/${routePrefix}/login/${userType}`;
    }

    try {
      const response = await axios.post(url, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      if (onLogin) onLogin(user, token);
      switch (user.type) {
        case 'donor': navigate('/dashboard/donor'); break;
        case 'hospital': navigate('/dashboard/hospital'); break;
        case 'admin': navigate('/dashboard/admin'); break;
        case 'requester': navigate('/dashboard/requester'); break;
        default: navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #f8f7ff 50%, #fff0fb 100%)' }}>
      {/* Background blobs */}
      <div className="fixed top-20 left-10 w-80 h-80 bg-rose-200 rounded-full blur-3xl opacity-25 pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-72 h-72 bg-violet-200 rounded-full blur-3xl opacity-25 pointer-events-none" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side */}
        <div className="hidden lg:block">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVhbSUyMGRvY3RvcnxlbnwxfHx8fDE3NjkxNjIyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Medical Team"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-8">
                <div className="text-white space-y-3">
                  <div className="inline-block px-3 py-1 bg-rose-500/80 rounded-full text-xs font-bold backdrop-blur-sm">
                    🩸 Blood Donation Platform
                  </div>
                  <h2 className="text-4xl font-extrabold">Welcome Back!</h2>
                  <p className="text-gray-200">Continue your journey of saving lives.</p>

                  {/* Stats */}
                  <div className="flex gap-4 pt-2">
                    {[['50K+', 'Donors'], ['12K+', 'Lives Saved'], ['500+', 'Hospitals']].map(([num, label]) => (
                      <div key={label} className="text-center glass rounded-xl px-4 py-2">
                        <div className="font-extrabold text-lg text-white">{num}</div>
                        <div className="text-xs text-gray-300">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
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
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Sign In</h1>
            <p className="text-gray-500">Access your account to continue</p>
          </div>

          {/* User Type Selector */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Sign in as</label>
            <div className="grid grid-cols-4 gap-2 bg-gray-50 rounded-2xl p-1.5">
              {userTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: type.id })}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl font-semibold text-xs transition-all ${
                    formData.userType === type.id
                      ? 'bg-white text-gray-900 shadow-md scale-105'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={formData.userType === type.id ? { boxShadow: '0 4px 12px rgba(255,59,92,0.2)' } : {}}
                >
                  <span className="text-xl">{type.emoji}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-rose-400"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-rose-400"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-3.5 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-rose-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold" style={{ color: '#ff3b5c' }}>Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-xl"
              style={{
                background: loading ? '#ccc' : 'linear-gradient(135deg, #ff3b5c, #ff6b35)',
                boxShadow: loading ? 'none' : '0 8px 25px rgba(255, 59, 92, 0.4)'
              }}
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Signing in...</span></>
              ) : (
                <><span>Sign In</span><ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold hover:underline" style={{ color: '#ff3b5c' }}>Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
