const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const { generateCertificatePDF, generateCertificateBase64 } = require('../services/certificateService');
const { sendCertificateEmail } = require('../services/emailService');

/**
 * Get certificate for a specific donation
 */
async function getCertificate(req, res) {
    try {
        const { donationId } = req.params;
        const donorId = req.user._id || req.user.id;

        const donation = await Donation.findOne({ 
            _id: donationId, 
            donor: donorId 
        }).populate('hospital', 'HospitalName City');

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (!donation.certificateId) {
            return res.status(400).json({ message: 'Certificate not available for this donation' });
        }

        const donor = await Donor.findById(donorId).select('name bloodGroup donationCount level');

        const certificateData = {
            certificateId: donation.certificateId,
            donorName: donor.name,
            bloodGroup: donor.bloodGroup,
            donationDate: donation.donationDate,
            hospitalName: donation.hospitalName || 
                (donation.hospital ? donation.hospital.HospitalName : 'Blood Donation Center'),
            units: donation.units,
            donorLevel: donor.level,
            donationCount: donor.donationCount
        };

        res.status(200).json({
            certificate: certificateData,
            downloadUrl: `/api/certificates/${donationId}/download`
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching certificate', error: error.message });
    }
}

/**
 * Download certificate as PDF
 */
async function downloadCertificate(req, res) {
    try {
        const { donationId } = req.params;
        const donorId = req.user._id || req.user.id;

        const donation = await Donation.findOne({ 
            _id: donationId, 
            donor: donorId 
        }).populate('hospital', 'HospitalName City');

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        const donor = await Donor.findById(donorId).select('name bloodGroup donationCount level');

        const certificateData = {
            certificateId: donation.certificateId || `CERT-${donation._id.toString().slice(-10)}`,
            donorName: donor.name,
            bloodGroup: donor.bloodGroup,
            donationDate: donation.donationDate,
            hospitalName: donation.hospitalName || 
                (donation.hospital ? donation.hospital.HospitalName : 'Blood Donation Center'),
            units: donation.units,
            donorLevel: donor.level,
            donationCount: donor.donationCount
        };

        const pdfBuffer = await generateCertificatePDF(certificateData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 
            `attachment; filename="blood-donation-certificate-${certificateData.certificateId}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Certificate generation error:', error);
        res.status(500).json({ message: 'Error generating certificate', error: error.message });
    }
}

/**
 * Send certificate via email
 */
async function emailCertificate(req, res) {
    try {
        const { donationId } = req.params;
        const donorId = req.user._id || req.user.id;

        const donation = await Donation.findOne({ 
            _id: donationId, 
            donor: donorId 
        }).populate('hospital', 'HospitalName City');

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        const donor = await Donor.findById(donorId).select('name email bloodGroup donationCount level');

        const certificateDetails = {
            certificateId: donation.certificateId || `CERT-${donation._id.toString().slice(-10)}`,
            donationDate: donation.donationDate,
            hospitalName: donation.hospitalName || 
                (donation.hospital ? donation.hospital.HospitalName : 'Blood Donation Center'),
            bloodGroup: donor.bloodGroup,
            units: donation.units
        };

        const result = await sendCertificateEmail(donor.email, donor.name, certificateDetails);

        if (result.success) {
            res.status(200).json({ message: 'Certificate sent to your email' });
        } else {
            res.status(500).json({ 
                message: 'Failed to send email', 
                error: result.error || 'Email service not configured'
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error sending certificate', error: error.message });
    }
}

/**
 * Get all certificates for a donor
 */
async function getAllCertificates(req, res) {
    try {
        const donorId = req.user._id || req.user.id;

        const donations = await Donation.find({ 
            donor: donorId,
            status: 'completed'
        })
        .populate('hospital', 'HospitalName City')
        .sort({ donationDate: -1 });

        const certificates = donations.map(donation => ({
            donationId: donation._id,
            certificateId: donation.certificateId || `CERT-${donation._id.toString().slice(-10)}`,
            donationDate: donation.donationDate,
            hospitalName: donation.hospitalName || 
                (donation.hospital ? donation.hospital.HospitalName : 'Blood Donation Center'),
            bloodGroup: donation.bloodGroup,
            units: donation.units,
            downloadUrl: `/api/certificates/${donation._id}/download`
        }));

        res.status(200).json({
            count: certificates.length,
            certificates
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching certificates', error: error.message });
    }
}

module.exports = {
    getCertificate,
    downloadCertificate,
    emailCertificate,
    getAllCertificates
};
