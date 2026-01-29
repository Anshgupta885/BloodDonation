import React, { useState } from 'react';
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
import PublicLayout from './pages/PublicLayout.jsx';

// A simple component to demonstrate a nested route if needed
const DashboardHome = () => <div>Welcome to the dashboard!</div>;

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-request" element={<CreateRequest />} />
        </Route>
        
        {/* Example of a dashboard layout route */}
        <Route 
          path="/dashboard" 
          element={
            <DashboardLayout 
              user={user} 
              userType={user?.type} 
              onLogout={handleLogout} 
            />
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="hospital" element={<HospitalDashboard />} />
          <Route path="donor" element={<DonorDashboard />} />
          <Route path="create-request" element={<CreateRequest user={user} />} />
        </Route>
        <Route path="/history" element={<DonationHistory user={user} />} />
        <Route path="/profile" element={<DonorProfile user={user} />} />
        <Route path="/search" element={<DonorSearch />} />
        <Route path="/manage-donors" element={<ManageDonors />} />
        <Route path="/manage-hospitals" element={<ManageHospitals />} />
        <Route path="/request-status" element={<RequestStatus user={user} />} />

      </Routes>
    </Router>
  );
}

export default App;
