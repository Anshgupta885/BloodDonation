import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Droplet, LogOut, User, Home, Activity, Search, FileText, Users, Building2, Settings } from 'lucide-react';

export default function DashboardLayout({ userType, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  const getDonorNavItems = () => [
    { path: '/dashboard/donor', icon: Home, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/history', icon: Activity, label: 'Donation History' },
  ];

  const getHospitalNavItems = () => [
    { path: '/dashboard/hospital', icon: Home, label: 'Dashboard' },
    { path: '/dashboard/create-request', icon: FileText, label: 'Create Request' },
    { path: '/search', icon: Search, label: 'Search Donors' },
    { path: '/request-status', icon: Activity, label: 'Request Status' },
  ];

  const getAdminNavItems = () => [
    { path: '/dashboard/admin', icon: Home, label: 'Dashboard' },
    { path: '/manage-donors', icon: Users, label: 'Manage Donors' },
    { path: '/manage-hospitals', icon: Building2, label: 'Manage Hospitals' },
  ];

  const navItems = 
    userType === 'donor' ? getDonorNavItems() :
    userType === 'hospital' ? getHospitalNavItems() :
    userType === 'admin' ? getAdminNavItems() : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Droplet className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">LifeFlow</h1>
                <p className="text-xs text-gray-500 capitalize">{userType} Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px] hidden md:block">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-4 py-2 ${
                    isActive ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 mb-20 md:mb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}