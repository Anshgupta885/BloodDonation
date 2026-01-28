const express = require('express');
const router = express.Router();
const { registerHospital, loginHospital, logoutHospital } = require('../controllers/AuthController');

router.post('/register/hospital', registerHospital);
router.post('/login/hospital', loginHospital);
router.get('/logout/hospital', logoutHospital);

module.exports = router;