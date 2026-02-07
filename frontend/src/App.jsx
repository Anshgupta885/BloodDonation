import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

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
import RequesterDashboard from './pages/RequesterDashboard.jsx';
import RequestStatus from './pages/RequestStatus.jsx';
import PublicLayout from './pages/PublicLayout.jsx';
import UpdateRequesterPage from './pages/UpdateRequesterPage.jsx';
import HospitalProfile from './pages/HospitalProfile.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if token has expiration and if it's still valid (or no expiration set)
        const isTokenValid = !decodedToken.exp || (decodedToken.exp * 1000 > Date.now());
        if (isTokenValid) {
          const fetchUser = async () => {
            try {
              // Note: The '/api/auth/me' endpoint will need to handle different user types
              // This is a placeholder for a generic endpoint, which we may need to adjust
              const response = await axios.get(`/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              console.log('User data from /api/auth/me:', response.data);
              setUser(response.data.user);
            } catch (error) {
              console.error("Failed to fetch user data", error);
              handleLogout();
            } finally {
              setLoading(false);
            }
          };
          fetchUser();
        } else {
          handleLogout();
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to decode token", error);
        handleLogout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (loggedInUser, token) => {
    setUser(loggedInUser);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={user ? <DashboardLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        >
          {/* Redirect to user-specific dashboard */}
          <Route index element={
            user ? <Navigate to={`/dashboard/${user.type}`} /> : <Navigate to="/login" />
          } />
          <Route path="admin" element={<AdminDashboard user={user} onLogout={handleLogout}/>} />
          <Route path="hospital" element={<HospitalDashboard user={user} onLogout={handleLogout} />} />
          <Route path="hospital/profile" element={<HospitalProfile />} />
          <Route path="donor" element={<DonorDashboard user={user} onLogout={handleLogout} />} />
          <Route path="requester" element={<RequesterDashboard user={user} onLogout={handleLogout} />} />
          <Route path="requester/update" element={<UpdateRequesterPage user={user} />} />
          <Route path="create-request" element={<CreateRequest user={user} onLogout={handleLogout} />} />
          {/* Nested routes for donor */}
          <Route path="donor/history" element={<DonationHistory user={user} />} />
          <Route path="donor/profile" element={<DonorProfile user={user} />} />
          {/* Nested routes for admin */}
          <Route path="admin/manage-donors" element={<ManageDonors />} />
          <Route path="admin/manage-hospitals" element={<ManageHospitals />} />
        </Route>

        {/* Other protected or public routes as needed */}
        <Route path="/search" element={<DonorSearch />} />
        <Route path="/request-status" element={<RequestStatus user={user} />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={user ? `/dashboard/${user.type}` : "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;

