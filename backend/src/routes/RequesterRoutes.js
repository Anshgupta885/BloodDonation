const express = require('express');
const router = express.Router();
const { createRequester, loginRequester, getRequesterDashboard } = require('../controllers/AuthController');
const { updateRequesterDetails } = require('../controllers/updateDetails.Controller');
const { multiTypeAuthMiddleware } = require('../middlewares/auth.middlewares');

router.post('/register', createRequester);
router.post('/login', loginRequester);
router.put('/profile', updateRequesterDetails);
router.get('/dashboard', multiTypeAuthMiddleware, getRequesterDashboard);

module.exports = router;
