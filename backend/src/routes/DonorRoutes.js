const express = require('express');
const router = express.Router();
const { registerDonor, loginDonor, logoutDonor } = require('../controllers/AuthController');

router.post('/register/donor', registerDonor);
router.post('/login/donor', loginDonor);
router.get('/logout/donor', logoutDonor);

module.exports = router;