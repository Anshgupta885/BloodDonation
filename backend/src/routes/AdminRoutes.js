const express = require('express');
const router = express.Router();
const { logoutAdmin, LoginAdmin, registerAdmin, getAdminDashboard } = require('../controllers/AuthController');
const { authMiddleware } = require('../middlewares/auth.middlewares');
const Admin = require('../models/Admin');

// Admin routes
router.post('/register/admin', registerAdmin);
router.post('/login/admin', LoginAdmin);
router.get('/logout/admin', logoutAdmin);
router.get('/admin/dashboard', authMiddleware(Admin), getAdminDashboard);

module.exports = router;