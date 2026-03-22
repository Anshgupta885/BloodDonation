const express = require('express');
const router = express.Router();
const { createRequester, loginRequester, getRequesterDashboard } = require('../controllers/AuthController');
const { updateRequesterDetails } = require('../controllers/updateDetails.Controller');
const { multiTypeAuthMiddleware } = require('../middlewares/auth.middlewares');
const { requireFields, validateEmailAndPassword } = require('../middlewares/validation.middleware');

router.post('/register', requireFields(['name', 'email', 'phone', 'city', 'address', 'password']), validateEmailAndPassword, createRequester);
router.post('/login', requireFields(['email', 'password']), loginRequester);
router.put('/profile', updateRequesterDetails);
router.get('/dashboard', multiTypeAuthMiddleware, getRequesterDashboard);

module.exports = router;
