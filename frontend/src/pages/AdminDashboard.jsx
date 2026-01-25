import React from 'react';
import { Link } from 'react-router';
import DashboardLayout from './DashboardLayout';
import { Users, Building2, Droplet, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminDashboard({ user, onLogout }) {
  const stats = [
    { label: 'Total Donors', value: '50,234', icon: Users, color: 'blue', change: '+12%' },
    { label: 'Total Hospitals', value: '523', icon: Building2, color: 'purple', change: '+5%' },
    { label: 'Blood Requests', value: '1,456', icon: Activity, color: 'orange', change: '+8%' },
    { label: 'Units Donated', value: '8,943', icon: Droplet, color: 'red', change: '+15%' },
  ];

  // Monthly donations data
  const monthlyData = [
    { month: 'Jan', donations: 650 },
    { month: 'Feb', donations: 720 },
    { month: 'Mar', donations: 680 },
    { month: 'Apr', donations: 790 },
    { month: 'May', donations: 850 },
    { month: 'Jun', donations: 920 },
  ];

  // Blood group distribution
  const bloodGroupData = [
    { name: 'O+', value: 38 },
    { name: 'A+', value: 28 },
    { name: 'B+', value: 15 },
    { name: 'AB+', value: 8 },
    { name: 'O-', value: 5 },
    { name: 'A-', value: 3 },
    { name: 'B-', value: 2 },
    { name: 'AB-', value: 1 },
  ];

  const COLORS = ['#DC2626', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280'];

  // Recent activities
  const recentActivities = [
    { id: 1, type: 'donor', message: 'New donor registered: John Smith', time: '5 mins ago', status: 'success' },
    { id: 2, type: 'hospital', message: 'City Hospital created urgent blood request', time: '15 mins ago', status: 'warning' },
    { id: 3, type: 'donation', message: 'Donation completed at Memorial Hospital', time: '1 hour ago', status: 'success' },
    { id: 4, type: 'hospital', message: 'New hospital verified: St. Mary Medical Center', time: '2 hours ago', status: 'info' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'donor': return Users;
      case 'hospital': return Building2;
      case 'donation': return Droplet;
      default: return Activity;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-orange-100 text-orange-700';
      case 'info': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout userType="admin" user={user} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">System overview and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Donations Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Donations</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Area type="monotone" dataKey="donations" stroke="#DC2626" fillOpacity={1} fill="url(#colorDonations)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Blood Group Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Blood Group Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bloodGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bloodGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities and Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.status)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">{activity.message}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Link
              to="/admin/manage-donors"
              className="block bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <Users className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Manage Donors</h3>
              <p className="text-blue-100">View and manage donor accounts</p>
            </Link>
            
            <Link
              to="/admin/manage-hospitals"
              className="block bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <Building2 className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Manage Hospitals</h3>
              <p className="text-purple-100">View and verify hospitals</p>
            </Link>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-orange-900 mb-1">System Notice</h3>
              <p className="text-orange-700 mb-3">Scheduled maintenance on January 25, 2026 from 2:00 AM to 4:00 AM EST.</p>
              <button className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}