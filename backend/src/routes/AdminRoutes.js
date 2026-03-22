const express = require('express');
const router = express.Router();
const { logoutAdmin, LoginAdmin, registerAdmin } = require('../controllers/AuthController');
const { listUsers, setBlockedStatus } = require('../controllers/AdminUserController');
const { authMiddleware } = require('../middlewares/auth.middlewares');
const Admin = require('../models/Admin');
const { requireFields, validateEmailAndPassword } = require('../middlewares/validation.middleware');

// Admin routes
router.post('/register/admin', requireFields(['email', 'password', 'secretKey']), validateEmailAndPassword, registerAdmin);
router.post('/login/admin', requireFields(['email', 'password']), LoginAdmin);
router.get('/logout/admin', logoutAdmin);
router.get('/users', authMiddleware(Admin), listUsers);
router.patch('/users/:type/:id/block', authMiddleware(Admin), (req, res, next) => {
	req.body.isBlocked = true;
	return setBlockedStatus(req, res, next);
});
router.patch('/users/:type/:id/unblock', authMiddleware(Admin), (req, res, next) => {
	req.body.isBlocked = false;
	return setBlockedStatus(req, res, next);
});

module.exports = router;