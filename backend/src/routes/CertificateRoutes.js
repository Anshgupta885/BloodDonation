const express = require('express');
const router = express.Router();
const { 
    getCertificate, 
    downloadCertificate, 
    emailCertificate, 
    getAllCertificates 
} = require('../controllers/CertificateController');
const { authMiddleware } = require('../middlewares/auth.middlewares');
const Donor = require('../models/Donor');

// All certificate routes require donor authentication
router.get('/', authMiddleware(Donor), getAllCertificates);
router.get('/:donationId', authMiddleware(Donor), getCertificate);
router.get('/:donationId/download', authMiddleware(Donor), downloadCertificate);
router.post('/:donationId/email', authMiddleware(Donor), emailCertificate);

module.exports = router;
