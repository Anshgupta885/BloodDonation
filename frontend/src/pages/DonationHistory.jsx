import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Building2, Droplet, Award, CheckCircle, Loader, Download, Mail } from 'lucide-react';
import axios from 'axios';

function Activity({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export default function DonationHistory({ user, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [downloadingCert, setDownloadingCert] = useState(null);

  useEffect(() => {
    fetchDonationHistory();
  }, []);

  const fetchDonationHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await axios.get('/api/donors/donations/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch donation history');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (donationId) => {
    try {
      setDownloadingCert(donationId);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`/api/certificates/${donationId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `blood-donation-certificate-${donationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download certificate. Please try again.');
    } finally {
      setDownloadingCert(null);
    }
  };

  const handleEmailCertificate = async (donationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/certificates/${donationId}/email`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Certificate sent to your email!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send email. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-rose-100 border-t-rose-500 animate-spin" />
          <Droplet className="absolute inset-0 m-auto w-6 h-6 text-rose-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 bg-red-50 rounded-2xl p-4 font-medium">{error}</div>;
  }

  // Use API data or fallback to defaults
  const donations = data?.donations || [];
  const stats = data?.stats || { totalDonations: 0, totalUnits: 0, livesSaved: 0, yearsDonating: 0 };
  const levelInfo = data?.levelInfo || { current: 'Bronze', next: 'Silver', donations: 0, needed: 5, progress: 0 };
  const eligibility = data?.eligibility || { isEligible: true, nextEligibleDate: null, daysUntilEligible: 0 };

  const statItems = [
    { label: 'Total Donations', value: stats.totalDonations.toString(), emoji: '🩸', bg: 'stat-red' },
    { label: 'Total Units', value: stats.totalUnits.toString(), emoji: '💉', bg: 'stat-blue' },
    { label: 'Lives Saved', value: stats.livesSaved.toString(), emoji: '❤️', bg: 'stat-green' },
    { label: 'Years Donating', value: stats.yearsDonating.toString(), emoji: '🏆', bg: 'stat-purple' },
  ];

  const levelColors = {
    Bronze: { color: '#f59e0b', gradient: 'from-amber-400 to-yellow-500' },
    Silver: { color: '#9ca3af', gradient: 'from-gray-400 to-gray-500' },
    Gold: { color: '#fbbf24', gradient: 'from-yellow-400 to-amber-500' },
    Platinum: { color: '#60a5fa', gradient: 'from-blue-400 to-indigo-500' },
    Diamond: { color: '#a855f7', gradient: 'from-purple-400 to-pink-500' }
  };

  const currentLevelStyle = levelColors[levelInfo.current] || levelColors.Bronze;

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
        {statItems.map((stat, i) => (
          <div key={i} className={`rounded-2xl p-6 card-lift cursor-default ${stat.bg}`}>
            <div className="text-3xl mb-4">{stat.emoji}</div>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Achievement Card */}
      <div className="rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
        style={{ background: `linear-gradient(135deg, ${currentLevelStyle.color}, ${currentLevelStyle.color}dd)`, boxShadow: `0 20px 60px ${currentLevelStyle.color}66` }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-20 -translate-x-10" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl flex-shrink-0">
            🏅
          </div>
          <div className="flex-1">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Current Level</p>
            <h2 className="text-3xl font-extrabold mb-1">{levelInfo.current} Donor</h2>
            <p className="text-white/80 text-sm mb-4">{Math.max(0, levelInfo.needed - levelInfo.donations)} more donations to reach {levelInfo.next} level! 🚀</p>
            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${levelInfo.progress}%` }} />
            </div>
            <p className="text-white/70 text-xs mt-2">{levelInfo.donations}/{levelInfo.needed} donations</p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Next Level</p>
            <p className="text-2xl font-extrabold">🥈 {levelInfo.next}</p>
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
          {donations.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-lg mb-2">No donations yet</p>
              <p className="text-sm">Your donation history will appear here after your first donation.</p>
            </div>
          ) : (
            donations.map((donation, index) => (
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

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDownloadCertificate(donation.id)}
                        disabled={downloadingCert === donation.id}
                        className="px-4 py-2 text-sm font-bold rounded-xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-50"
                      >
                        {downloadingCert === donation.id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        Certificate
                      </button>
                      <button 
                        onClick={() => handleEmailCertificate(donation.id)}
                        className="px-3 py-2 text-sm font-bold rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Email Certificate"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Next Donation Banner */}
      <div className="rounded-2xl p-6 flex items-start gap-4 border"
        style={{ background: eligibility.isEligible ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)' : 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderColor: eligibility.isEligible ? '#a7f3d0' : '#bfdbfe' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: eligibility.isEligible ? '#d1fae5' : '#dbeafe' }}>
          {eligibility.isEligible ? '✅' : '📅'}
        </div>
        <div>
          <h3 className={`font-bold mb-1 ${eligibility.isEligible ? 'text-green-900' : 'text-blue-900'}`}>
            {eligibility.isEligible ? 'You are eligible to donate!' : 'Ready for your next donation?'}
          </h3>
          <p className={`text-sm mb-3 ${eligibility.isEligible ? 'text-green-700' : 'text-blue-700'}`}>
            {eligibility.isEligible 
              ? 'Schedule your next donation appointment today.'
              : eligibility.nextEligibleDate 
                ? `You'll be eligible to donate again on ${new Date(eligibility.nextEligibleDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` 
                : `${eligibility.daysUntilEligible} days until you're eligible again.`
            }
          </p>
          <button 
            className={`px-6 py-2.5 text-white rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-105 ${!eligibility.isEligible && 'opacity-75'}`}
            style={{ 
              background: eligibility.isEligible 
                ? 'linear-gradient(135deg, #10b981, #059669)' 
                : 'linear-gradient(135deg, #3b82f6, #2563eb)', 
              boxShadow: eligibility.isEligible 
                ? '0 6px 20px rgba(16,185,129,0.35)' 
                : '0 6px 20px rgba(59,130,246,0.35)' 
            }}
          >
            📅 Schedule Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
