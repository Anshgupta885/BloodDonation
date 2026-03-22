import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, MapPin, FileText, AlertCircle, Calendar, Send, Loader, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function CreateRequest({ user, onLogout }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bloodGroup: 'A+',
    units: '1',
    urgency: 'Moderate',
    city: '',
    pincode: '',
    patientName: '',
    byDate: '',
    purpose: '',
    contactName: '',
    contactPhone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { id: 'Critical', emoji: '🚨', desc: 'Life-threatening' },
    { id: 'Urgent', emoji: '⚠️', desc: 'Needed soon' },
    { id: 'Moderate', emoji: '📋', desc: 'Can wait briefly' },
  ];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) { setError('You must be logged in to create a request.'); return; }
      const payload = { ...formData, units: parseInt(formData.units, 10) };
      await axios.post('/api/request', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Request created successfully! Redirecting...');
      setTimeout(() => navigate(`/dashboard/${user.type}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request.');
    } finally {
      setLoading(false);
    }
  };

  const urgencyColors = {
    Critical: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600', active: true },
    Urgent: { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-600' },
    Moderate: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-600' },
  };

  const inputClass = "w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-rose-400 bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Create Blood <span style={{ color: '#ff3b5c' }}>Request</span>
        </h1>
        <p className="text-gray-500 mt-1">Submit a new blood donation request</p>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-4 p-5 rounded-2xl border" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderColor: '#bfdbfe' }}>
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl shrink-0">💡</div>
        <div>
          <h3 className="font-bold text-blue-900 mb-0.5">Request Guidelines</h3>
          <p className="text-blue-700 text-sm">Provide accurate information to help donors respond quickly. Critical requests will be highlighted to nearby donors immediately.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-7">
        {/* Feedback */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 p-4 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            <p className="text-sm text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Blood Group & Units */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>🩸 Blood Group Required *</label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((group) => (
                <button key={group} type="button" onClick={() => setFormData({ ...formData, bloodGroup: group })}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    formData.bloodGroup === group ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={formData.bloodGroup === group ? {
                    background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)',
                    boxShadow: '0 4px 12px rgba(255,59,92,0.35)'
                  } : {}}>
                  {group}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>📦 Units Needed *</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setFormData({ ...formData, units: String(Math.max(1, parseInt(formData.units) - 1)) })}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-xl font-bold transition-colors flex items-center justify-center">−</button>
              <input type="number" name="units" value={formData.units} onChange={handleChange} min="1" max="10"
                className="flex-1 text-center text-2xl font-extrabold py-2.5 border-2 border-gray-200 rounded-xl outline-none focus:border-rose-400" required />
              <button type="button" onClick={() => setFormData({ ...formData, units: String(Math.min(10, parseInt(formData.units) + 1)) })}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-xl font-bold transition-colors flex items-center justify-center">+</button>
            </div>
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className={labelClass}>⚡ Urgency Level *</label>
          <div className="grid grid-cols-3 gap-3">
            {urgencyLevels.map((level) => (
              <button key={level.id} type="button" onClick={() => setFormData({ ...formData, urgency: level.id })}
                className={`flex flex-col items-center gap-1 py-4 rounded-2xl font-semibold transition-all border-2 ${
                  formData.urgency === level.id
                    ? `${urgencyColors[level.id].bg} ${urgencyColors[level.id].border} ${urgencyColors[level.id].text} shadow-md scale-[1.02]`
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}>
                <span className="text-2xl">{level.emoji}</span>
                <span>{level.id}</span>
                <span className="text-xs opacity-70">{level.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Name */}
        <div>
          <label className={labelClass}>👤 Patient Name *</label>
          <div className="relative">
            <input type="text" name="patientName" value={formData.patientName} onChange={handleChange}
              placeholder="Enter patient name" className={inputClass} required />
          </div>
        </div>

        {/* City, Pincode & Date */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>📍 City *</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" name="city" value={formData.city} onChange={handleChange}
                placeholder="Enter city" className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-rose-400" required />
            </div>
          </div>
          <div>
            <label className={labelClass}># Pincode</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange}
              placeholder="Enter pincode" className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-rose-400" />
          </div>
          <div>
            <label className={labelClass}>📅 Required By *</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="date" name="byDate" value={formData.byDate} onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-rose-400" required />
            </div>
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className={labelClass}>📝 Reason for Request *</label>
          <textarea name="purpose" value={formData.purpose} onChange={handleChange}
            placeholder="Brief description of why blood is needed..." rows="4"
            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-rose-400 resize-none" required />
        </div>

        {/* Contact Info */}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span>📞</span> Contact Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Contact Person *</label>
              <input type="text" name="contactName" value={formData.contactName} onChange={handleChange}
                placeholder="Name of contact person" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Contact Phone *</label>
              <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange}
                placeholder="+1 (555) 000-0000" className={inputClass} required />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-white rounded-2xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 shadow-xl"
            style={{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #ff3b5c, #ff6b35)',
              boxShadow: loading ? 'none' : '0 8px 25px rgba(255,59,92,0.4)'
            }}>
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
          <button type="button" onClick={() => navigate(user ? `/dashboard/${user.type}` : '/')}
            className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-bold">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
