import React from 'react';
import { Calendar, MapPin, Building2, Droplet, Award, CheckCircle } from 'lucide-react';

function Activity({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export default function DonationHistory({ user, onLogout }) {
  const donations = [
    { id: 1, date: '2025-12-08', hospital: 'City General Hospital', location: 'New York, NY', units: 1, status: 'Completed', impact: '3 lives saved' },
    { id: 2, date: '2025-09-15', hospital: 'St. Mary Medical Center', location: 'New York, NY', units: 1, status: 'Completed', impact: '3 lives saved' },
    { id: 3, date: '2025-06-20', hospital: 'Memorial Hospital', location: 'New York, NY', units: 1, status: 'Completed', impact: '3 lives saved' },
    { id: 4, date: '2025-03-10', hospital: 'Central Healthcare', location: 'New York, NY', units: 1, status: 'Completed', impact: '3 lives saved' },
    { id: 5, date: '2024-12-05', hospital: 'City General Hospital', location: 'New York, NY', units: 1, status: 'Completed', impact: '3 lives saved' },
    { id: 6, date: '2024-09-18', hospital: 'University Hospital', location: 'New York, NY', units: 1, status: 'Completed', impact: '3 lives saved' },
  ];

  const stats = [
    { label: 'Total Donations', value: '12', emoji: '🩸', bg: 'stat-red' },
    { label: 'Total Units', value: '12', emoji: '💉', bg: 'stat-blue' },
    { label: 'Lives Saved', value: '36', emoji: '❤️', bg: 'stat-green' },
    { label: 'Years Donating', value: '3', emoji: '🏆', bg: 'stat-purple' },
  ];

  const levelInfo = { current: 'Bronze', next: 'Silver', donations: 12, needed: 15, color: '#f59e0b', gradient: 'from-amber-400 to-yellow-500' };
  const progress = (levelInfo.donations / levelInfo.needed) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Donation <span style={{ color: '#ff3b5c' }}>History</span>
        </h1>
        <p className="text-gray-500 mt-1">Track your life-saving journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`rounded-2xl p-6 card-lift cursor-default ${stat.bg}`}>
            <div className="text-3xl mb-4">{stat.emoji}</div>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Achievement Card */}
      <div className="rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 20px 60px rgba(245,158,11,0.4)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-20 -translate-x-10" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl flex-shrink-0">
            🏅
          </div>
          <div className="flex-1">
            <p className="text-amber-200 text-xs font-bold uppercase tracking-widest mb-1">Current Level</p>
            <h2 className="text-3xl font-extrabold mb-1">Bronze Donor</h2>
            <p className="text-amber-100 text-sm mb-4">{levelInfo.needed - levelInfo.donations} more donations to reach Silver level! 🚀</p>
            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-amber-200 text-xs mt-2">{levelInfo.donations}/{levelInfo.needed} donations</p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-amber-200 text-xs font-bold uppercase tracking-widest mb-1">Next Level</p>
            <p className="text-2xl font-extrabold">🥈 Silver</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-xl">📋</div>
          <div>
            <h2 className="font-bold text-gray-900">Donation Timeline</h2>
            <p className="text-xs text-gray-500">Your complete donation history</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {donations.map((donation, index) => (
            <div key={donation.id} className="relative flex gap-4">
              {/* Timeline line */}
              {index < donations.length - 1 && (
                <div className="absolute left-5 top-12 w-0.5 h-full bg-gradient-to-b from-rose-200 to-transparent" />
              )}

              {/* Dot */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-lg"
                  style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' }}>
                  ✓
                </div>
              </div>

              {/* Card */}
              <div className="flex-1 bg-gray-50 hover:bg-white rounded-2xl p-5 border border-gray-100 hover:border-rose-100 hover:shadow-md transition-all card-lift mb-2">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="font-bold text-gray-900">{donation.hospital}</h3>
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">✅ {donation.status}</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4 text-rose-400" />
                        <span>{new Date(donation.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>{donation.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Droplet className="w-4 h-4 text-rose-500" fill="currentColor" />
                        <span>{donation.units} unit donated</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#f59e0b' }}>
                        <span>🌟</span>
                        <span>{donation.impact}</span>
                      </div>
                    </div>
                  </div>

                  <button className="px-4 py-2 text-sm font-bold rounded-xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors whitespace-nowrap">
                    📜 Certificate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Donation Banner */}
      <div className="rounded-2xl p-6 flex items-start gap-4 border"
        style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderColor: '#bfdbfe' }}>
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">📅</div>
        <div>
          <h3 className="font-bold text-blue-900 mb-1">Ready for your next donation?</h3>
          <p className="text-blue-700 text-sm mb-3">You'll be eligible to donate again on <strong>January 23, 2026</strong></p>
          <button className="px-6 py-2.5 text-white rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 6px 20px rgba(59,130,246,0.35)' }}>
            📅 Schedule Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
