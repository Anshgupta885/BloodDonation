import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Droplet, Edit2, Save, Loader2, Camera } from 'lucide-react';
import axios from 'axios';

export default function DonorProfile({ user, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', bloodGroup: '', city: '',
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/donors/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const donor = response.data.donor;
      setFormData({
        name: donor.name || '', email: donor.email || '', phone: donor.phone || '',
        bloodGroup: donor.bloodGroup || '', city: donor.city || '',
      });
      setProfilePicture(donor.profilePicture || null);
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    setUploadingPicture(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        const token = localStorage.getItem('token');
        await axios.put('/api/donors/profile/picture', { profilePicture: base64 }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfilePicture(base64);
        setUploadingPicture(false);
      };
      reader.onerror = () => {
        setError('Failed to read image file');
        setUploadingPicture(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload profile picture');
      setUploadingPicture(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/donors/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const bloodGroupColors = {
    'A+': '#ff3b5c', 'A-': '#ff6b35', 'B+': '#7c3aed', 'B-': '#2563eb',
    'AB+': '#10b981', 'AB-': '#f59e0b', 'O+': '#ec4899', 'O-': '#6366f1',
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-rose-100 border-t-rose-500 animate-spin" />
        <Droplet className="absolute inset-0 m-auto w-6 h-6 text-rose-500" />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl font-medium text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            My <span style={{ color: '#ff3b5c' }}>Profile</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)', boxShadow: '0 6px 20px rgba(255,59,92,0.35)' }}>
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)}
              className="px-5 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 6px 20px rgba(16,185,129,0.35)' }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Profile Hero Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-36 relative" style={{ background: 'linear-gradient(135deg, #ff3b5c 0%, #ff6b35 50%, #7c3aed 100%)' }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>

        {/* Avatar + Name */}
        <div className="px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-6">
            <div className="relative">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-4xl font-extrabold text-white"
                  style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' }}>
                  {formData.name ? formData.name[0].toUpperCase() : '?'}
                </div>
              )}
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePictureUpload} className="hidden" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPicture}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-100 hover:bg-gray-50 disabled:opacity-50">
                {uploadingPicture ? <Loader2 className="w-4 h-4 text-gray-600 animate-spin" /> : <Camera className="w-4 h-4 text-gray-600" />}
              </button>
            </div>
          </div>

          {/* Fields Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
              {isEditing ? (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-rose-400 transition-all" />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">{formData.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
              {isEditing ? (
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-rose-400 transition-all" />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">{formData.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
              {isEditing ? (
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-rose-400 transition-all" />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">{formData.phone}</span>
                </div>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">City</label>
              {isEditing ? (
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" name="city" value={formData.city} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-rose-400 transition-all" />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">{formData.city}</span>
                </div>
              )}
            </div>

            {/* Blood Group */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Blood Group</label>
              {isEditing ? (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {bloodGroups.map((group) => (
                    <button key={group} type="button" onClick={() => setFormData({ ...formData, bloodGroup: group })}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                        formData.bloodGroup === group ? 'text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={formData.bloodGroup === group ? { background: bloodGroupColors[group] || '#ff3b5c', boxShadow: '0 4px 12px rgba(255,59,92,0.35)' } : {}}>
                      {group}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${bloodGroupColors[formData.bloodGroup] || '#ff3b5c'}, ${bloodGroupColors[formData.bloodGroup] || '#ff3b5c'}bb)` }}>
                  <Droplet className="w-5 h-5" fill="currentColor" />
                  <span className="font-extrabold text-xl">{formData.bloodGroup}</span>
                  <span className="text-white/80 text-sm">Blood Group</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { emoji: '🩸', label: 'Blood Group', value: formData.bloodGroup || '—' },
          { emoji: '📍', label: 'City', value: formData.city || '—' },
          { emoji: '📞', label: 'Phone', value: formData.phone || '—' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center card-lift">
            <div className="text-3xl mb-2">{item.emoji}</div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
            <p className="font-bold text-gray-900 truncate">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
