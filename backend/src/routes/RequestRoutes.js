const express = require('express');
const router = express.Router();
const { createRequest } = require('../controllers/RequestController');
const { authMiddleware } = require('../middlewares/auth.middlewares');
const Hospital = require('../models/Hospital');

router.post('/request', authMiddleware(Hospital), createRequest);

module.exports = router;
