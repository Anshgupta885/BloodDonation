const express = require('express');
const router = express.Router();
const { registerHospital, loginHospital, logoutHospital, getHospitalDashboard } = require('../controllers/AuthController');
const { updateHospitalDetails } = require('../controllers/updateDetails.Controller');
const { authMiddleware } = require('../middlewares/auth.middlewares');
const Hospital = require('../models/Hospital');

router.post('/register/hospital', registerHospital);
router.post('/login/hospital', loginHospital);
router.get('/logout/hospital', logoutHospital);
router.get('/hospital/dashboard', authMiddleware(Hospital), getHospitalDashboard);

// Profile routes
router.get('/hospital/profile', authMiddleware(Hospital), async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user._id).select('-password');
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        res.status(200).json({ hospital });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

router.put('/hospital/profile', updateHospitalDetails);

module.exports = router;