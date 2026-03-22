import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Droplet, LogOut, User, Home, Activity, Search, FileText, Users, Building2, Menu, X, ChevronRight } from 'lucide-react';

export default function DashboardLayout({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = user?.type;
  const roleDisplay = userType === 'requester' ? 'recipient/patient' : userType;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  const getDonorNavItems = () => [
    { path: '/dashboard/donor', icon: Home, label: 'Dashboard', emoji: '🏠' },
    { path: '/dashboard/donor/profile', icon: User, label: 'Profile', emoji: '👤' },
    { path: '/dashboard/donor/history', icon: Activity, label: 'Donation History', emoji: '📋' },
  ];

  const getHospitalNavItems = () => [
    { path: '/dashboard/hospital', icon: Home, label: 'Dashboard', emoji: '🏠' },
    { path: '/dashboard/hospital/profile', icon: User, label: 'Profile', emoji: '🏥' },
    { path: '/dashboard/create-request', icon: FileText, label: 'Create Request', emoji: '📝' },
    { path: '/dashboard/search', icon: Search, label: 'Search Donors', emoji: '🔍' },
    { path: '/request-status', icon: Activity, label: 'Request Status', emoji: '📊' },
  ];

  const getRequesterNavItems = () => [
    { path: '/dashboard/requester', icon: Home, label: 'Dashboard', emoji: '🏠' },
    { path: '/dashboard/create-request', icon: FileText, label: 'Create Request', emoji: '📝' },
    { path: '/dashboard/search', icon: Search, label: 'Find Donor', emoji: '🔍' },
    { path: '/request-status', icon: Activity, label: 'Request Status', emoji: '📊' },
  ];

  const getAdminNavItems = () => [
    { path: '/dashboard/admin', icon: Home, label: 'Dashboard', emoji: '🏠' },
    { path: '/dashboard/admin/manage-donors', icon: Users, label: 'Manage Donors', emoji: '👥' },
    { path: '/dashboard/admin/manage-hospitals', icon: Building2, label: 'Manage Hospitals', emoji: '🏥' },
  ];

  const navItems =
    userType === 'donor' ? getDonorNavItems() :
    userType === 'hospital' ? getHospitalNavItems() :
    userType === 'requester' ? getRequesterNavItems() :
    userType === 'admin' ? getAdminNavItems() : [];

  const typeColors = {
    donor: 'from-rose-500 to-pink-600',
    hospital: 'from-violet-500 to-purple-600',
    requester: 'from-orange-500 to-amber-600',
    admin: 'from-blue-600 to-indigo-700',
  };

  const typeBadge = {
    donor: 'bg-rose-100 text-rose-700',
    hospital: 'bg-violet-100 text-violet-700',
    requester: 'bg-orange-100 text-orange-700',
    admin: 'bg-blue-100 text-blue-700',
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`p-6 bg-gradient-to-br ${typeColors[userType] || 'from-rose-500 to-pink-600'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Droplet className="w-6 h-6 text-white" fill="white" />
          </div>
          <span className="font-bold text-white text-xl">LifeFlow</span>
        </div>
        <div className="glass rounded-xl p-3">
          <p className="text-white font-semibold text-sm truncate">{user?.name || user?.HospitalName || 'User'}</p>
          <p className="text-white/70 text-xs truncate">{user?.email}</p>
          <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white capitalize`}>
                {roleDisplay} Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-rose-500/15 to-pink-500/10 text-rose-600 font-semibold border border-rose-200/50 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-500 rounded-r-full" />}
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto text-rose-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #fff5f5 100%)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col sticky top-0 h-screen shadow-xl shadow-gray-200/50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white h-full shadow-2xl z-10 flex flex-col">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl z-10">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-xl">
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium capitalize">{userType}</span>
              </div>
              {/* Live indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full pulse-red" style={{ animation: 'pulse-ring 2s infinite', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.6)' }} />
                <span className="text-xs font-semibold text-green-700">Live</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${typeColors[userType] || 'from-rose-500 to-pink-600'} flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">
                    {(user?.name || user?.HospitalName || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-none">{user?.name || user?.HospitalName || 'User'}</p>
                  <p className={`text-xs capitalize mt-0.5 font-medium ${typeBadge[userType]?.split(' ')[1] || 'text-gray-500'}`}>{roleDisplay}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-30 shadow-2xl">
          <div className="flex justify-around py-2 px-2">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'text-rose-600 bg-rose-50'
                      : 'text-gray-500'
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
