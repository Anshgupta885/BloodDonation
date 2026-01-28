const express = require('express');
const router = express.Router();
const { logoutAdmin, LoginAdmin } = require('../controllers/AuthController');

// Admin login route
router.post('/login/admin', LoginAdmin);
router.get('/logout/admin', logoutAdmin);


module.exports = router;