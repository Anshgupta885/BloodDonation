const express = require('express');
const router = express.Router();
const { registerDonor, loginDonor, logoutDonor, getDonorDashboard, toggleDonorAvailability, searchDonors } = require('../controllers/AuthController');
const { updateDonorDetails } = require('../controllers/updateDetails.Controller');
const { authMiddleware, multiTypeAuthMiddleware } = require('../middlewares/auth.middlewares');
const { 
    getMatchingDonors, 
    checkDonorEligibility, 
    getDonationHistory, 
    recordDonation,
    getLeaderboard,
    getDonorRank,
    scheduleAppointment,
    getDonorAppointments,
    cancelAppointment
} = require('../controllers/DonorController');
const Donor = require('../models/Donor');
const { requireFields, validateEmailAndPassword } = require('../middlewares/validation.middleware');

router.post('/register/donor', requireFields(['name', 'bloodGroup', 'email', 'phone', 'city', 'password']), validateEmailAndPassword, registerDonor);
router.post('/login/donor', requireFields(['email', 'password']), loginDonor);
router.get('/logout/donor', logoutDonor);
router.get('/dashboard', authMiddleware(Donor), getDonorDashboard);
router.post('/availability', authMiddleware(Donor), toggleDonorAvailability);
router.get('/search', multiTypeAuthMiddleware, searchDonors);

// Donor matching & eligibility routes
router.get('/matching', multiTypeAuthMiddleware, getMatchingDonors);
router.get('/eligibility', authMiddleware(Donor), checkDonorEligibility);

// Donation history routes
router.get('/donations/history', authMiddleware(Donor), getDonationHistory);
router.post('/donations/record', multiTypeAuthMiddleware, recordDonation);

// Leaderboard routes
router.get('/leaderboard', getLeaderboard);
router.get('/rank', authMiddleware(Donor), getDonorRank);

// Appointment routes
router.post('/appointments', authMiddleware(Donor), scheduleAppointment);
router.get('/appointments', authMiddleware(Donor), getDonorAppointments);
router.delete('/appointments/:appointmentId', authMiddleware(Donor), cancelAppointment);

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