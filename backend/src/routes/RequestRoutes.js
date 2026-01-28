const express = require('express');
const { RegisterRequest,LoginRequest, logoutRequest } = require('../controllers/AuthController');

const router = express.Router();

router.post('/register/request', RegisterRequest);
router.post('/login/request', LoginRequest);
router.get('/logout/request', logoutRequest);

module.exports = router;