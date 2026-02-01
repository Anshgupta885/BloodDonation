const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/AuthController');
const { multiTypeAuthMiddleware } = require('../middlewares/auth.middlewares');

router.get('/me', multiTypeAuthMiddleware, getMe);

module.exports = router;
