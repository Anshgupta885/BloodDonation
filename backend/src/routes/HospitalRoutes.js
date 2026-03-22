const express = require('express');
const router = express.Router();
const { registerHospital, loginHospital, logoutHospital, getHospitalDashboard } = require('../controllers/AuthController');
const { updateHospitalDetails } = require('../controllers/updateDetails.Controller');
const { multiTypeAuthMiddleware } = require('../middlewares/auth.middlewares');
const { 
    initializeBloodStock,
    getBloodStock, 
    updateBloodStock, 
    updateThreshold,
    getLowStockAlerts,
    batchUpdateBloodStock
} = require('../controllers/BloodStockController');
const { getHospitalAppointments, completeAppointment } = require('../controllers/DonorController');
const Hospital = require('../models/Hospital');
const { requireFields, validateEmailAndPassword } = require('../middlewares/validation.middleware');

router.post('/register', requireFields(['name', 'city', 'address', 'phone', 'email', 'password']), validateEmailAndPassword, registerHospital);
router.post('/login/hospital', requireFields(['email', 'password']), loginHospital);
router.get('/logout/hospital', logoutHospital);
router.get('/dashboard', multiTypeAuthMiddleware, getHospitalDashboard);

// Blood Stock routes
router.post('/blood-stock/init', multiTypeAuthMiddleware, initializeBloodStock);
router.get('/blood-stock', multiTypeAuthMiddleware, getBloodStock);
router.put('/blood-stock', multiTypeAuthMiddleware, updateBloodStock);
router.put('/blood-stock/threshold', multiTypeAuthMiddleware, updateThreshold);
router.get('/blood-stock/alerts', multiTypeAuthMiddleware, getLowStockAlerts);
router.put('/blood-stock/batch', multiTypeAuthMiddleware, batchUpdateBloodStock);

// Hospital Appointments routes
router.get('/appointments', multiTypeAuthMiddleware, getHospitalAppointments);
router.post('/appointments/:appointmentId/complete', multiTypeAuthMiddleware, completeAppointment);


// Profile routes
router.get('/profile', multiTypeAuthMiddleware, async (req, res) => {
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

router.put('/profile', updateHospitalDetails);

module.exports = router;