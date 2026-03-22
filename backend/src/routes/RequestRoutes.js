const express = require('express');
const router = express.Router();
const {
	createRequest,
	getRequesterRequests,
	deleteRequest,
	getEmergencyRequests,
	respondToRequest,
	sendEmergencyBroadcast,
	completeRequest,
	getPublicCriticalRequests
} = require('../controllers/RequestController');
const { multiTypeAuthMiddleware, donorAuthMiddleware } = require('../middlewares/auth.middlewares');
const { requireFields, validateRequestPayload } = require('../middlewares/validation.middleware');

router.get('/requests/public-critical', getPublicCriticalRequests);
router.post('/request', multiTypeAuthMiddleware, requireFields(['bloodGroup', 'units', 'urgency', 'patientName', 'city', 'byDate', 'purpose', 'contactName', 'contactPhone']), validateRequestPayload, createRequest);
router.get('/requests/me', multiTypeAuthMiddleware, getRequesterRequests);
router.delete('/requests/:id', multiTypeAuthMiddleware, deleteRequest);
router.get('/requests/emergency', donorAuthMiddleware, getEmergencyRequests);
router.post('/requests/:id/respond', donorAuthMiddleware, respondToRequest);
router.post('/requests/:id/complete', multiTypeAuthMiddleware, completeRequest);
router.post('/requests/:id/broadcast', multiTypeAuthMiddleware, sendEmergencyBroadcast);

module.exports = router;
