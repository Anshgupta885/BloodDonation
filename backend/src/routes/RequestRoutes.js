const express = require('express');
const router = express.Router();
const { createRequest, getRequesterRequests, deleteRequest } = require('../controllers/RequestController');
const { multiTypeAuthMiddleware } = require('../middlewares/auth.middlewares');

router.post('/request', multiTypeAuthMiddleware, createRequest);
router.get('/requests/me', multiTypeAuthMiddleware, getRequesterRequests);
router.delete('/requests/:id', multiTypeAuthMiddleware, deleteRequest);

module.exports = router;
