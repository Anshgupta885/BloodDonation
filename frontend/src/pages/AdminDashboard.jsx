import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, Droplet, Activity, AlertCircle, Loader } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function AdminDashboard({ user, onLogout }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [userCounts, setUserCounts] = useState({ total: 0, blocked: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) { setError('Authentication token not found.'); return; }
        const [analyticsRes, usersRes] = await Promise.all([
          axios.get('/api/analytics', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/admins/users?type=all', {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        const users = Array.isArray(usersRes.data?.users) ? usersRes.data.users : [];
        setUserCounts({
          total: users.length,
          blocked: users.filter((u) => u.isBlocked).length
        });
        setDashboardData(analyticsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-rose-100 border-t-rose-500 animate-spin" />
        <Droplet className="absolute inset-0 m-auto w-6 h-6 text-rose-500" />
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center gap-4 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
      <AlertCircle className="w-6 h-6 shrink-0" />
      <p className="font-medium">{error}</p>
    </div>
  );

  if (!dashboardData) return null;

  const { stats, monthlyData, bloodGroupData, recentActivity } = dashboardData;
  const statItems = [
    { label: 'Total Donors', value: stats.totalDonors, icon: '👥', emoji: '🩸', color: '#ff3b5c', bg: 'stat-red' },
    { label: 'Total Hospitals', value: stats.totalHospitals, icon: '🏥', emoji: '🏥', color: '#7c3aed', bg: 'stat-purple' },
    { label: 'Blood Requests', value: stats.totalRequests, icon: '📋', emoji: '📋', color: '#f97316', bg: 'stat-orange' },
    { label: 'Units Donated', value: stats.totalUnitsDonated, icon: '💉', emoji: '💉', color: '#10b981', bg: 'stat-green' },
  ];

  const COLORS = ['#ff3b5c', '#ff6b35', '#f59e0b', '#10b981', '#3b82f6', '#7c3aed', '#ec4899', '#6b7280'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-3">
          <p className="font-bold text-gray-900">{label}</p>
          <p className="text-rose-500 font-semibold">{payload[0].value} donations</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Admin <span style={{ color: '#ff3b5c' }}>Dashboard</span>
          </h1>
          <p className="text-gray-500 mt-1">System overview and analytics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-green-700">All Systems Operational</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <div key={index} className={`rounded-2xl p-6 card-lift cursor-default ${stat.bg}`}>
            <div className="text-4xl mb-4">{stat.icon}</div>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
            <div className="mt-3 h-1 rounded-full opacity-40" style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}88)` }} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #ff3b5c15, #ff6b3508)' }}>📈</div>
            <div>
              <h2 className="font-bold text-gray-900">Monthly Donations</h2>
              <p className="text-xs text-gray-500">Donation trends this year</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3b5c" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ff3b5c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="donations" stroke="#ff3b5c" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDonations)" dot={{ fill: '#ff3b5c', strokeWidth: 2, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #7c3aed15, #2563eb08)' }}>🩸</div>
            <div>
              <h2 className="font-bold text-gray-900">Blood Group Distribution</h2>
              <p className="text-xs text-gray-500">Donor blood type breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={bloodGroupData} cx="50%" cy="50%" labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={95} innerRadius={35} fill="#8884d8" dataKey="value" strokeWidth={2} stroke="#fff">
                {bloodGroupData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Donors']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activities + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <h2 className="font-bold text-gray-900">Live System Metrics</h2>
          </div>
          <div className="p-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider">Last 7 Days</p>
              <p className="text-2xl font-extrabold text-blue-900 mt-1">{recentActivity?.donations || 0}</p>
              <p className="text-sm text-blue-700">Donations completed</p>
            </div>
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
              <p className="text-xs text-orange-700 font-semibold uppercase tracking-wider">Last 7 Days</p>
              <p className="text-2xl font-extrabold text-orange-900 mt-1">{recentActivity?.requests || 0}</p>
              <p className="text-sm text-orange-700">Requests created</p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
              <p className="text-xs text-rose-700 font-semibold uppercase tracking-wider">Users</p>
              <p className="text-2xl font-extrabold text-rose-900 mt-1">{userCounts.total}</p>
              <p className="text-sm text-rose-700">Total platform users</p>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-xs text-red-700 font-semibold uppercase tracking-wider">Users</p>
              <p className="text-2xl font-extrabold text-red-900 mt-1">{userCounts.blocked}</p>
              <p className="text-sm text-red-700">Blocked accounts</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link to="/dashboard/admin/manage-donors" className="card-lift block rounded-2xl p-6 text-white overflow-hidden relative shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 10px 30px rgba(59,130,246,0.35)' }}>
            <div className="absolute top-0 right-0 text-8xl opacity-10">👥</div>
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-1">Manage Donors</h3>
            <p className="text-blue-100 text-sm">View and manage donor accounts</p>
          </Link>
          <Link to="/dashboard/admin/manage-hospitals" className="card-lift block rounded-2xl p-6 text-white overflow-hidden relative shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 10px 30px rgba(124,58,237,0.35)' }}>
            <div className="absolute top-0 right-0 text-8xl opacity-10">🏥</div>
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-xl font-bold mb-1">Manage Hospitals</h3>
            <p className="text-purple-100 text-sm">View and manage hospital accounts</p>
          </Link>
        </div>
      </div>

      {/* System Notice */}
      <div className="rounded-2xl p-6 border flex items-start gap-4" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', borderColor: '#fed7aa' }}>
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 text-xl">⚠️</div>
        <div>
          <h3 className="font-bold text-orange-900 mb-1">System Notice</h3>
          <p className="text-orange-700 text-sm mb-3">Scheduled maintenance on January 31, 2026 from 2:00 AM to 4:00 AM EST.</p>
          <button className="px-4 py-2 text-sm bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold">View Details</button>
        </div>
      </div>
    </div>
  );
}
