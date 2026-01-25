import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import DashboardLayout from './DashboardLayout';
import { Droplet, MapPin, FileText, AlertCircle, Calendar, Send } from 'lucide-react';

export default function CreateRequest({ user, onLogout }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bloodGroup: 'A+',
    units: '1',
    urgency: 'Moderate',
    city: '',
    patientName: '',
    requiredBy: '',
    reason: '',
    contactPerson: '',
    contactPhone: '',
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['Critical', 'Urgent', 'Moderate'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    navigate('/hospital/request-status');
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'border-red-500 bg-red-50';
      case 'Urgent': return 'border-orange-500 bg-orange-50';
      case 'Moderate': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  return (
    <DashboardLayout userType="hospital" user={user} onLogout={onLogout}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Blood Request</h1>
          <p className="text-gray-600 mt-1">Submit a new blood donation request</p>
        </div>

        {/* Info Alert */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
          {/* Blood Group & Units */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group Required *
              </label>
              <div className="relative">
                <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Units Needed *
              </label>
              <input
                type="number"
                name="units"
                value={formData.units}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Urgency Level *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {urgencyLevels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: level })}
                  className={`px-4 py-3 rounded-xl font-medium transition-all border-2 ${
                    formData.urgency === level
                      ? getUrgencyColor(level)
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name *
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Enter patient name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* City & Required By */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required By *
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="requiredBy"
                  value={formData.requiredBy}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Request *
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Brief description of why blood is needed"
                rows="4"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Name of contact person"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 font-medium"
            >
              <Send className="w-5 h-5" />
              Submit Request
            </button>
            <button
              type="button"
              onClick={() => navigate('/hospital/dashboard')}
              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}