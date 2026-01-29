const express = require('express');
const { RegisterRequest,LoginRequest, logoutRequest, getRequestDashboard } = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth.middlewares');
const Request = require('../models/Request');
const router = express.Router();

router.post('/register/request', RegisterRequest);
router.post('/login/request', LoginRequest);
router.get('/logout/request', logoutRequest);
router.get('/request/dashboard', authMiddleware(Request));
module.exports = router;