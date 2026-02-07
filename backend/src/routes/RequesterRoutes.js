const express = require('express');
const router = express.Router();
const { createRequester, loginRequester } = require('../controllers/AuthController');
const { updateRequesterDetails } = require('../controllers/updateDetails.Controller');

router.post('/register', createRequester);
router.post('/login', loginRequester);
router.put('/profile', updateRequesterDetails);

module.exports = router;
