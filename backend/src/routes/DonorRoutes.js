const express = require('express');
const router = express.Router();
const { registerDonor, loginDonor, logoutDonor, getDonorDashboard, toggleDonorAvailability, searchDonors } = require('../controllers/AuthController');
const { updateDonorDetails } = require('../controllers/updateDetails.Controller');
const { authMiddleware, multiTypeAuthMiddleware } = require('../middlewares/auth.middlewares');
const Donor = require('../models/Donor');

router.post('/register/donor', registerDonor);
router.post('/login/donor', loginDonor);
router.get('/logout/donor', logoutDonor);
router.get('/dashboard', authMiddleware(Donor), getDonorDashboard);
router.post('/availability', authMiddleware(Donor), toggleDonorAvailability);
router.get('/search', multiTypeAuthMiddleware, searchDonors);

// Profile routes
router.get('/profile', authMiddleware(Donor), async (req, res) => {
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

router.put('/profile', updateDonorDetails);

// Profile picture upload
router.put('/profile/picture', authMiddleware(Donor), async (req, res) => {
    try {
        const { profilePicture } = req.body;
        if (!profilePicture) {
            return res.status(400).json({ message: 'Profile picture is required' });
        }
        const donor = await Donor.findByIdAndUpdate(
            req.user._id,
            { profilePicture },
            { new: true }
        ).select('-password');
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }
        res.status(200).json({ message: 'Profile picture updated', donor });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile picture', error: error.message });
    }
});

module.exports = router;