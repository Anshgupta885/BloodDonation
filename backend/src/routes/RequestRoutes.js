const express = require('express');
const router = express.Router();
const { createRequest } = require('../controllers/RequestController');
const { multiTypeAuthMiddleware } = require('../middlewares/auth.middlewares');

router.post('/request', multiTypeAuthMiddleware, createRequest);

module.exports = router;
