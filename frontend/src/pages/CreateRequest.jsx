import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Droplet, MapPin, FileText, AlertCircle, Calendar, Send,
  Loader, CheckCircle
} from 'lucide-react';
import axios from 'axios';

export default function CreateRequest({ user, onLogout }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bloodGroup: 'A+',
    units: '1',
    urgency: 'Moderate',
    city: '',
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
  const urgencyLevels = ['Critical', 'Urgent', 'Moderate'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create a request.');
        return;
      }
      
      const payload = {
        ...formData,
        units: parseInt(formData.units, 10),
      };

      await axios.post('/api/request', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Request created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard/hospital');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request.');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'border-red-500 bg-red-50 text-red-700';
      case 'Urgent': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'Moderate': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      default: return 'border-gray-300 bg-white';
    }
  };

  return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Blood Request</h1>
          <p className="text-gray-600 mt-1">Submit a new blood donation request</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Request Guidelines</h3>
              <p className="text-blue-700 text-sm">
                Provide accurate information to help donors respond quickly. Critical requests will be highlighted to nearby donors.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg" role="alert">
              {success}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group Required *</label>
              <div className="relative">
                <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl" required>
                  {bloodGroups.map((group) => <option key={group} value={group}>{group}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Units Needed *</label>
              <input type="number" name="units" value={formData.units} onChange={handleChange} min="1" max="10" className="w-full px-4 py-3 border border-gray-300 rounded-xl" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Urgency Level *</label>
            <div className="grid grid-cols-3 gap-3">
              {urgencyLevels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: level })}
                  className={`px-4 py-3 rounded-xl font-medium transition-all border-2 ${formData.urgency === level ? getUrgencyColor(level) : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
            <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} placeholder="Enter patient name" className="w-full px-4 py-3 border border-gray-300 rounded-xl" required />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Enter city" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required By *</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="date" name="byDate" value={formData.byDate} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl" required />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Request *</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <textarea name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Brief description of why blood is needed" rows="4" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl resize-none" required />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Name of contact person" className="w-full px-4 py-3 border border-gray-300 rounded-xl" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone *</label>
                <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 border border-gray-300 rounded-xl" required />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 font-medium disabled:bg-red-400">
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button type="button" onClick={() => navigate(user ? '/dashboard/hospital' : '/')} className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
              Cancel
            </button>
          </div>
        </form>
      </div>
  );
}