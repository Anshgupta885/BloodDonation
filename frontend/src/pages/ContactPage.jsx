import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const contacts = [
    { icon: Phone, label: 'Phone', value: '1-800-DONATE' },
    { icon: Mail, label: 'Email', value: 'support@lifeflow.org' },
    { icon: MapPin, label: 'Address', value: '123 Life St, Everytown' },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #f8f7ff 45%, #fff0fb 100%)' }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
        <section className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-5">
            <MessageCircle className="w-4 h-4" /> Contact LifeFlow
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">We’re here to help</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Reach out for support, partnership questions, or platform feedback. If you are facing an urgent blood request, use the request flow inside the app as well.
          </p>

          <div className="space-y-4">
            {contacts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">{label}</p>
                  <p className="font-bold text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-900 text-white rounded-3xl shadow-2xl p-8 lg:p-12 overflow-hidden relative">
          <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at top right, rgba(255,59,92,0.35), transparent 35%), radial-gradient(circle at bottom left, rgba(255,107,53,0.25), transparent 30%)' }} />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-4">Need a faster response?</h2>
            <p className="text-white/75 leading-relaxed mb-8">
              Sign in to create a request, find donors, or monitor the status of an existing case.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-gray-900 bg-white hover:scale-105 transition-transform">
                Sign In <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white border border-white/20 hover:bg-white/10 transition-colors">
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}