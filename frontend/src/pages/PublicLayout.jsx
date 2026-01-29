import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Droplet, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Public Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Droplet className="w-7 h-7 text-white" fill="white" />
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-800 tracking-wider">LifeFlow</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-red-600 transition-colors duration-300 font-medium text-lg">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-red-600 transition-colors duration-300 font-medium text-lg">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-red-600 transition-colors duration-300 font-medium text-lg">
                Contact
              </Link>
            </div>

            <div className="flex items-center">
              <Link
                to="/login"
                className="px-6 py-3 text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10">
        <Outlet />
      </main>

      {/* Enhanced Public Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Droplet className="w-7 h-7 text-white" fill="white" />
                </div>
                <span className="text-2xl font-bold text-white">LifeFlow</span>
              </div>
              <p className="text-gray-400">
                Connecting blood donors with recipients to save lives.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-red-500 transition-colors">Home</a></li>
                <li><a href="/about" className="hover:text-red-500 transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-red-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram size={24} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Phone size={20} />
                  <span>1-800-DONATE</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={20} />
                  <span>support@lifeflow.org</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={20} />
                  <span>123 Life St, Everytown</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} LifeFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

