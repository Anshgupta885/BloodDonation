const express = require('express');
const router = express.Router();
const { 
    getAnalytics, 
    getBloodStockOverview, 
    getDonationTrends, 
    getRequestAnalytics,
    getQuickStats 
} = require('../controllers/AnalyticsController');
const { authMiddleware, multiTypeAuthMiddleware } = require('../middlewares/auth.middlewares');
const Admin = require('../models/Admin');

// Admin-only routes for comprehensive analytics
router.get('/', authMiddleware(Admin), getAnalytics);
router.get('/blood-stock', authMiddleware(Admin), getBloodStockOverview);
router.get('/donations/trends', authMiddleware(Admin), getDonationTrends);
router.get('/requests', authMiddleware(Admin), getRequestAnalytics);

// Quick stats can be accessed by admin and hospital
router.get('/quick-stats', multiTypeAuthMiddleware, getQuickStats);

module.exports = router;
