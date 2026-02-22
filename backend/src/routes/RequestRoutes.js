const express = require('express');
const router = express.Router();
const { createRequest, getRequesterRequests, deleteRequest, getEmergencyRequests, respondToRequest } = require('../controllers/RequestController');
const { multiTypeAuthMiddleware, donorAuthMiddleware } = require('../middlewares/auth.middlewares');

router.post('/request', multiTypeAuthMiddleware, createRequest);
router.get('/requests/me', multiTypeAuthMiddleware, getRequesterRequests);
router.delete('/requests/:id', multiTypeAuthMiddleware, deleteRequest);
router.get('/requests/emergency', donorAuthMiddleware, getEmergencyRequests);
router.post('/requests/:id/respond', donorAuthMiddleware, respondToRequest);

module.exports = router;
