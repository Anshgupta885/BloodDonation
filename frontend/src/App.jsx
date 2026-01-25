
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminDashboard from './pages/AdminDashboard.jsx';
import CreateRequest from './pages/CreateRequest.jsx';
import DashboardLayout from './pages/DashboardLayout.jsx';
import DonationHistory from './pages/DonationHistory.jsx';
import DonorDashboard from './pages/DonorDashboard.jsx';
import DonorProfile from './pages/DonorProfile.jsx';
import DonorSearch from './pages/DonorSearch.jsx';
import HospitalDashboard from './pages/HospitalDashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ManageDonors from './pages/ManageDonors.jsx';
import ManageHospitals from './pages/ManageHospitals.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import RequestStatus from './pages/RequestStatus.jsx';

// A simple component to demonstrate a nested route if needed
const DashboardHome = () => <div>Welcome to the dashboard!</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Example of a dashboard layout route */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="hospital" element={<HospitalDashboard />} />
          <Route path="donor" element={<DonorDashboard />} />
        </Route>

        <Route path="/create-request" element={<CreateRequest />} />
        <Route path="/history" element={<DonationHistory />} />
        <Route path="/profile" element={<DonorProfile />} />
        <Route path="/search" element={<DonorSearch />} />
        <Route path="/manage-donors" element={<ManageDonors />} />
        <Route path="/manage-hospitals" element={<ManageHospitals />} />
        <Route path="/request-status" element={<RequestStatus />} />

      </Routes>
    </Router>
  );
}

export default App;
