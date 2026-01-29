const express = require('express');
const router = express.Router();
const { logoutAdmin, LoginAdmin, getAdminDashboard } = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth.middlewares');
const Admin = require('../models/Admin');

// Admin login route
router.post('/login/admin', LoginAdmin);
router.get('/logout/admin', logoutAdmin);
router.get('/admin/dashboard', authMiddleware(Admin));

module.exports = router;