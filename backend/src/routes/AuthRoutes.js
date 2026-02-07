const express = require('express');
const router = express.Router();
const { getMe, getProfile } = require('../controllers/AuthController');
const { multiTypeAuthMiddleware } = require('../middlewares/auth.middlewares');

router.get('/me', multiTypeAuthMiddleware, getMe);
router.get('/profile', multiTypeAuthMiddleware, getProfile);

module.exports = router;
