import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Droplet, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Menu, X } from 'lucide-react';

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#f8f7ff' }}>
      {/* Enhanced Sticky Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-100'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' }}>
                <Droplet className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-2xl font-extrabold text-gray-900">
                Life<span style={{ color: '#ff3b5c' }}>Flow</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {[{ to: '/', label: 'Home' }, { to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact' }].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-semibold transition-all hover:text-rose-500 relative group ${
                    location.pathname === link.to ? 'text-rose-500' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${
                    location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' }} />
                </Link>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl hover:scale-105 transition-all shadow-lg"
                style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)', boxShadow: '0 6px 20px rgba(255, 59, 92, 0.35)' }}
              >
                Sign In
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-xl">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-gray-100 pt-4">
              {[{ to: '/', label: '🏠 Home' }, { to: '/about', label: 'ℹ️ About Us' }, { to: '/contact', label: '📬 Contact' }, { to: '/login', label: '🔑 Sign In' }].map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }} className="text-gray-300">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' }}>
                  <Droplet className="w-6 h-6 text-white" fill="white" />
                </div>
                <span className="text-2xl font-extrabold text-white">LifeFlow</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Connecting blood donors with recipients to save lives. Every drop counts.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-rose-500 transition-all hover:scale-110">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-5">Quick Links</h3>
              <ul className="space-y-3">
                {['Home', 'About Us', 'Contact', 'Register', 'Login'].map(label => (
                  <li key={label}>
                    <a href="#" className="text-sm text-gray-400 hover:text-rose-400 transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 bg-rose-500 rounded-full" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Portal Links */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-5">Portals</h3>
              <ul className="space-y-3">
                {['🩸 Donor Portal', '🏥 Hospital Portal', '💊 Requester Portal', '🔐 Admin Portal'].map(label => (
                  <li key={label}>
                    <a href="/login" className="text-sm text-gray-400 hover:text-rose-400 transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-5">Contact Us</h3>
              <ul className="space-y-4">
                {[
                  { Icon: Phone, text: '1-800-DONATE' },
                  { Icon: Mail, text: 'support@lifeflow.org' },
                  { Icon: MapPin, text: '123 Life St, Everytown' }
                ].map(({ Icon, text }, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-rose-400" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} LifeFlow. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-rose-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-rose-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
