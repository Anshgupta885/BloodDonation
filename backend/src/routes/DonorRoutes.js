const express = require('express');
const router = express.Router();
const { registerDonor, loginDonor, logoutDonor, getDonorDashboard, toggleDonorAvailability } = require('../controllers/AuthController');
const { updateDonorDetails } = require('../controllers/updateDetails.Controller');
const { authMiddleware } = require('../middlewares/auth.middlewares');
const Donor = require('../models/Donor');

router.post('/register/donor', registerDonor);
router.post('/login/donor', loginDonor);
router.get('/logout/donor', logoutDonor);
router.get('/donor/dashboard', authMiddleware(Donor), getDonorDashboard);
router.post('/donor/availability', authMiddleware(Donor), toggleDonorAvailability);

// Profile routes
router.get('/donor/profile', authMiddleware(Donor), async (req, res) => {
    try {
        const donor = await Donor.findById(req.user._id).select('-password');
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }
        res.status(200).json({ donor });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

router.put('/donor/profile', updateDonorDetails);

module.exports = router;