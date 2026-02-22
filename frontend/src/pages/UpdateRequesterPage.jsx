import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function UpdateRequesterPage({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', city: '' });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
      const r = response.data.user;
      setFormData({ name: r.name || '', email: r.email || '', phone: r.phone || '', address: r.address || '', city: r.city || '' });
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/requesters/profile', formData, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate(`/dashboard/${user?.type}`), 1500);
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
        <User className="absolute inset-0 m-auto w-6 h-6 text-orange-500" />
      </div>
    </div>
  );

  const fields = [
    { name: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your full name' },
    { name: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'Email', disabled: true },
    { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+1 (555) 000-0000' },
    { name: 'address', label: 'Address', icon: MapPin, type: 'text', placeholder: 'Your full address' },
    { name: 'city', label: 'City', icon: MapPin, type: 'text', placeholder: 'City' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Update <span style={{ color: '#f97316' }}>Profile</span>
          </h1>
          <p className="text-gray-500 mt-1">Keep your information up to date</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 6px 20px rgba(249,115,22,0.35)' }}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Feedback */}
      {error && <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl font-medium text-sm"><span>⚠️</span>{error}</div>}
      {success && <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl font-medium text-sm"><span>✅</span>{success}</div>}

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-24 relative" style={{ background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)' }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          <div className="absolute bottom-4 left-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Editing Profile</p>
            <p className="font-extrabold text-lg">{formData.name || 'Requester'}</p>
          </div>
        </div>

        <div className="p-8 space-y-5">
          {fields.map(({ name, label, icon: Icon, type, placeholder, disabled }) => (
            <div key={name}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
              <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={type} name={name} value={formData[name]} onChange={handleChange}
                  placeholder={placeholder} disabled={disabled}
                  className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all ${
                    disabled
                      ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'border-gray-200 focus:border-orange-400 hover:border-gray-300'
                  }`} />
              </div>
              {disabled && <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Profile Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Profile Preview</p>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            {formData.name ? formData.name[0].toUpperCase() : '?'}
          </div>
          <div>
            <p className="font-bold text-gray-900">{formData.name || '—'}</p>
            <p className="text-sm text-gray-500">{formData.email}</p>
            <div className="flex items-center gap-3 mt-1">
              {formData.city && <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{formData.city}</span>}
              {formData.phone && <span className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{formData.phone}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
