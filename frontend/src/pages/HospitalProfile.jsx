import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Edit2, Save, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function HospitalProfile({ user }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ HospitalName: '', email: '', phone: '', address: '', City: '' });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
      const hospital = response.data.user;
      setFormData({ HospitalName: hospital.HospitalName || '', email: hospital.email || '', phone: hospital.phone || '', address: hospital.address || '', City: hospital.City || '' });
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
      await axios.put('/api/hospitals/profile', formData, { headers: { Authorization: `Bearer ${token}` } });
      setIsEditing(false);
      navigate(`/dashboard/${user?.type}`);
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-500 animate-spin" />
        <Building2 className="absolute inset-0 m-auto w-6 h-6 text-violet-500" />
      </div>
    </div>
  );

  const fields = [
    { name: 'HospitalName', label: 'Hospital Name', icon: Building2, type: 'text' },
    { name: 'email', label: 'Email Address', icon: Mail, type: 'email', disabled: true },
    { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
    { name: 'address', label: 'Address', icon: MapPin, type: 'text' },
    { name: 'City', label: 'City', icon: MapPin, type: 'text' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl font-medium text-sm">⚠️ {error}</div>}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Hospital <span style={{ color: '#7c3aed' }}>Profile</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage your hospital's information</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 6px 20px rgba(124,58,237,0.35)' }}>
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 6px 20px rgba(16,185,129,0.35)' }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-32 relative" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%)' }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="absolute -bottom-8 left-8">
            <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              🏥
            </div>
          </div>
        </div>

        <div className="pt-12 px-8 pb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{formData.HospitalName}</h2>
          <p className="text-gray-500 text-sm mb-6">{formData.email} • {formData.City}</p>

          <div className="grid md:grid-cols-2 gap-5">
            {fields.map(({ name, label, icon: Icon, type, disabled }) => (
              <div key={name}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
                {isEditing && !disabled ? (
                  <div className="relative">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={type} name={name} value={formData[name]} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-violet-400 transition-all" />
                  </div>
                ) : (
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${disabled ? 'bg-gray-100 border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 font-medium text-sm">{formData[name] || '—'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { emoji: '📍', label: 'City', value: formData.City || '—' },
          { emoji: '📞', label: 'Phone', value: formData.phone || '—' },
          { emoji: '🏥', label: 'Status', value: 'Verified' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center card-lift">
            <div className="text-3xl mb-2">{item.emoji}</div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
            <p className="font-bold text-gray-900 text-sm truncate">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
