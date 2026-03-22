const Donor = require('../models/Donor');
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const Hospital = require('../models/Hospital');
const Appointment = require('../models/Appointment');
const BloodStock = require('../models/BloodStock');
const { addMonths, format, startOfDay, endOfDay } = require('date-fns');

// ============================================
// DONOR MATCHING & ELIGIBILITY
// ============================================

/**
 * Get eligible donors for a blood request
 * Filters by blood group, eligibility (3-month rule), availability
 * Optional: filter by city for distance-based sorting
 */
async function getMatchingDonors(req, res) {
    try {
        const { bloodGroup, city, pincode, urgency, latitude, longitude, radiusKm = 25 } = req.query;
        
        if (!bloodGroup) {
            return res.status(400).json({ message: 'Blood group is required' });
        }
        
        let donors;
        const parsedLat = Number(latitude);
        const parsedLng = Number(longitude);
        const hasGeoPoint = Number.isFinite(parsedLat) && Number.isFinite(parsedLng);

        // If coordinates are provided, prioritize true nearest donors.
        if (hasGeoPoint) {
            const eligibilityDate = new Date();
            eligibilityDate.setDate(eligibilityDate.getDate() - ELIGIBILITY_PERIOD_DAYS);

            donors = await Donor.find({
                bloodGroup,
                isAvailable: true,
                isBlocked: false,
                ...(pincode ? { pincode: String(pincode) } : {}),
                ...(city ? { city: { $regex: city, $options: 'i' } } : {}),
                $or: [
                    { lastDonationDate: null },
                    { lastDonationDate: { $lte: eligibilityDate } }
                ],
                location: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [parsedLng, parsedLat] },
                        $maxDistance: Number(radiusKm) * 1000
                    }
                }
            }).select('-password');
        } else {
            // Fallback to city/pincode + eligibility matching.
            donors = await Donor.findEligibleDonors(bloodGroup, city, pincode);
            donors = donors.filter(donor => !donor.isBlocked);
        }
        
        // Sort by reputation score (higher reputation first) for better matching
        donors = donors.sort((a, b) => b.reputationScore - a.reputationScore);
        
        // If urgent, prioritize donors with more donations (more reliable)
        if (urgency === 'Critical' || urgency === 'Urgent') {
            donors = donors.sort((a, b) => b.donationCount - a.donationCount);
        }
        
        const formattedDonors = donors.map(donor => ({
            id: donor._id,
            name: donor.name,
            bloodGroup: donor.bloodGroup,
            city: donor.city,
            pincode: donor.pincode,
            phone: donor.phone,
            email: donor.email,
            isEligible: donor.isEligible,
            daysUntilEligible: donor.daysUntilEligible,
            donationCount: donor.donationCount,
            level: donor.level,
            reputationScore: donor.reputationScore,
            lastDonation: donor.lastDonationDate 
                ? format(donor.lastDonationDate, 'MMM dd, yyyy')
                : 'Never donated'
        }));
        
        res.status(200).json({
            count: formattedDonors.length,
            donors: formattedDonors
        });
    } catch (error) {
        res.status(500).json({ message: 'Error finding matching donors', error: error.message });
    }
}

/**
 * Check donor eligibility status
 */
async function checkDonorEligibility(req, res) {
    try {
        const donorId = req.user._id || req.user.id;
        const donor = await Donor.findById(donorId);
        
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }
        
        const eligibilityInfo = {
            isEligible: donor.isEligible,
            lastDonationDate: donor.lastDonationDate,
            nextEligibleDate: donor.nextEligibleDate,
            daysUntilEligible: donor.daysUntilEligible,
            donationCount: donor.donationCount,
            level: donor.level,
            reputationScore: donor.reputationScore
        };
        
        res.status(200).json(eligibilityInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error checking eligibility', error: error.message });
    }
}

// ============================================
// DONATION HISTORY
// ============================================

/**
 * Get donation history for a donor
 */
async function getDonationHistory(req, res) {
    try {
        const donorId = req.user._id || req.user.id;
        
        const donations = await Donation.find({ donor: donorId })
            .populate('hospital', 'HospitalName City address')
            .sort({ donationDate: -1 });
        
        const donor = await Donor.findById(donorId).select('-password');
        
        // Calculate stats
        const totalDonations = donations.length;
        const totalUnits = donations.reduce((sum, d) => sum + d.units, 0);
        const livesSaved = totalUnits * 3; // Approximately 3 lives per unit
        
        // Get first donation date for "years donating"
        const firstDonation = donations.length > 0 
            ? donations[donations.length - 1].donationDate 
            : null;
        const yearsDonating = firstDonation 
            ? Math.floor((Date.now() - firstDonation.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
            : 0;
        
        // Format donations for frontend
        const formattedDonations = donations.map(donation => ({
            id: donation._id,
            date: format(donation.donationDate, 'yyyy-MM-dd'),
            hospital: donation.hospitalName || 
                (donation.hospital ? donation.hospital.HospitalName : 'Unknown Hospital'),
            location: donation.location || 
                (donation.hospital ? donation.hospital.City : 'Unknown'),
            units: donation.units,
            status: donation.status === 'completed' ? 'Completed' : donation.status,
            impact: `${donation.units * 3} lives saved`,
            certificateId: donation.certificateId
        }));
        
        // Level progress
        const levelThresholds = {
            Bronze: { current: 0, next: 5, nextLevel: 'Silver' },
            Silver: { current: 5, next: 15, nextLevel: 'Gold' },
            Gold: { current: 15, next: 25, nextLevel: 'Platinum' },
            Platinum: { current: 25, next: 50, nextLevel: 'Diamond' },
            Diamond: { current: 50, next: 100, nextLevel: 'Legend' }
        };
        
        const currentLevel = donor.level || 'Bronze';
        const levelInfo = levelThresholds[currentLevel];
        
        res.status(200).json({
            donations: formattedDonations,
            stats: {
                totalDonations,
                totalUnits,
                livesSaved,
                yearsDonating
            },
            levelInfo: {
                current: currentLevel,
                next: levelInfo.nextLevel,
                donations: donor.donationCount,
                needed: levelInfo.next,
                progress: Math.min(100, (donor.donationCount / levelInfo.next) * 100)
            },
            eligibility: {
                isEligible: donor.isEligible,
                nextEligibleDate: donor.nextEligibleDate,
                daysUntilEligible: donor.daysUntilEligible
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donation history', error: error.message });
    }
}

/**
 * Record a new donation (called when a donor responds to request or donates at hospital)
 */
async function recordDonation(req, res) {
    try {
        const { donorId, requestId, hospitalId, hospitalName, bloodGroup, units, location, notes } = req.body;
        
        const donor = await Donor.findById(donorId);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }
        
        // Check eligibility
        if (!donor.isEligible) {
            return res.status(400).json({ 
                message: 'Donor is not eligible yet',
                daysUntilEligible: donor.daysUntilEligible,
                nextEligibleDate: donor.nextEligibleDate
            });
        }
        
        // Generate certificate ID
        const certificateId = `CERT-${Date.now()}-${donorId.toString().slice(-6)}`;
        
        // Create donation record
        const donation = new Donation({
            donor: donorId,
            request: requestId,
            hospital: hospitalId,
            hospitalName,
            bloodGroup: bloodGroup || donor.bloodGroup,
            units: units || 1,
            location,
            status: 'completed',
            certificateId,
            notes
        });
        
        await donation.save();
        
        // Update donor stats
        await donor.recordDonation();
        
        // Update request status if linked
        if (requestId) {
            await Request.findByIdAndUpdate(requestId, { 
                status: 'completed',
                donor: donorId
            });
        }
        
        // Update hospital blood stock if applicable
        if (hospitalId) {
            await BloodStock.findOneAndUpdate(
                { hospital: hospitalId, bloodGroup: donor.bloodGroup },
                { $inc: { units: units || 1 }, lastUpdated: new Date() },
                { upsert: true, new: true }
            );
        }
        
        res.status(201).json({
            message: 'Donation recorded successfully',
            donation,
            certificateId,
            donorStats: {
                donationCount: donor.donationCount,
                level: donor.level,
                reputationScore: donor.reputationScore
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error recording donation', error: error.message });
    }
}

// ============================================
// LEADERBOARD
// ============================================

/**
 * Get donor leaderboard
 */
async function getLeaderboard(req, res) {
    try {
        const { limit = 10, city } = req.query;
        
        let query = {};
        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }
        
        const donors = await Donor.find(query)
            .select('name bloodGroup city donationCount reputationScore level profilePicture')
            .sort({ reputationScore: -1, donationCount: -1 })
            .limit(parseInt(limit));
        
        const leaderboard = donors.map((donor, index) => ({
            rank: index + 1,
            id: donor._id,
            name: donor.name,
            bloodGroup: donor.bloodGroup,
            city: donor.city,
            donationCount: donor.donationCount,
            reputationScore: donor.reputationScore,
            level: donor.level,
            profilePicture: donor.profilePicture
        }));
        
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
    }
}

/**
 * Get donor rank
 */
async function getDonorRank(req, res) {
    try {
        const donorId = req.user._id || req.user.id;
        const donor = await Donor.findById(donorId);
        
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }
        
        // Count donors with higher reputation score
        const rank = await Donor.countDocuments({
            reputationScore: { $gt: donor.reputationScore }
        }) + 1;
        
        const totalDonors = await Donor.countDocuments();
        
        res.status(200).json({
            rank,
            totalDonors,
            percentile: Math.round((1 - (rank / totalDonors)) * 100),
            donationCount: donor.donationCount,
            reputationScore: donor.reputationScore,
            level: donor.level
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donor rank', error: error.message });
    }
}

// ============================================
// APPOINTMENTS
// ============================================

/**
 * Schedule a donation appointment
 */
async function scheduleAppointment(req, res) {
    try {
        const donorId = req.user._id || req.user.id;
        const { hospitalId, scheduledDate, timeSlot, donationType, notes } = req.body;
        
        // Validate required fields
        if (!hospitalId || !scheduledDate || !timeSlot) {
            return res.status(400).json({ 
                message: 'Hospital, scheduled date, and time slot are required' 
            });
        }
        
        // Check if donor exists and is eligible
        const donor = await Donor.findById(donorId);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }
        
        if (!donor.isEligible) {
            return res.status(400).json({
                message: 'You are not eligible to donate yet',
                nextEligibleDate: donor.nextEligibleDate,
                daysUntilEligible: donor.daysUntilEligible
            });
        }
        
        // Check if hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        
        // Check for existing appointment on the same day
        const existingAppointment = await Appointment.findOne({
            donor: donorId,
            scheduledDate: {
                $gte: startOfDay(new Date(scheduledDate)),
                $lte: endOfDay(new Date(scheduledDate))
            },
            status: { $in: ['scheduled', 'confirmed'] }
        });
        
        if (existingAppointment) {
            return res.status(400).json({ 
                message: 'You already have an appointment scheduled for this day' 
            });
        }
        
        const appointment = new Appointment({
            donor: donorId,
            hospital: hospitalId,
            scheduledDate: new Date(scheduledDate),
            timeSlot,
            donationType: donationType || 'whole-blood',
            notes
        });
        
        await appointment.save();
        
        // Populate hospital info for response
        await appointment.populate('hospital', 'HospitalName City address');
        
        res.status(201).json({
            message: 'Appointment scheduled successfully',
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: 'Error scheduling appointment', error: error.message });
    }
}

/**
 * Get donor's upcoming appointments
 */
async function getDonorAppointments(req, res) {
    try {
        const donorId = req.user._id || req.user.id;
        
        const appointments = await Appointment.getUpcomingForDonor(donorId);
        
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
}

/**
 * Cancel an appointment
 */
async function cancelAppointment(req, res) {
    try {
        const donorId = req.user._id || req.user.id;
        const { appointmentId } = req.params;
        
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            donor: donorId
        });
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        if (appointment.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
        }
        
        appointment.status = 'cancelled';
        await appointment.save();
        
        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
    }
}

/**
 * Get hospital's appointments for a specific date
 */
async function getHospitalAppointments(req, res) {
    try {
        const hospitalId = req.user._id || req.user.id;
        const { date } = req.query;
        
        const appointmentDate = date ? new Date(date) : new Date();
        
        const appointments = await Appointment.getHospitalAppointments(hospitalId, appointmentDate);
        
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
}

/**
 * Complete an appointment (mark as completed and record donation)
 */
async function completeAppointment(req, res) {
    try {
        const { appointmentId } = req.params;
        const hospitalId = req.user._id || req.user.id;
        const { units, notes } = req.body;
        
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            hospital: hospitalId
        }).populate('donor');
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        if (appointment.status === 'completed') {
            return res.status(400).json({ message: 'Appointment already completed' });
        }
        
        // Mark appointment as completed
        appointment.status = 'completed';
        await appointment.save();
        
        // Record the donation
        const donor = appointment.donor;
        const hospital = await Hospital.findById(hospitalId);
        
        const certificateId = `CERT-${Date.now()}-${donor._id.toString().slice(-6)}`;
        
        const donation = new Donation({
            donor: donor._id,
            hospital: hospitalId,
            hospitalName: hospital.HospitalName,
            bloodGroup: donor.bloodGroup,
            units: units || 1,
            location: hospital.City,
            status: 'completed',
            certificateId,
            notes
        });
        
        await donation.save();
        await donor.recordDonation();
        
        // Update blood stock
        await BloodStock.findOneAndUpdate(
            { hospital: hospitalId, bloodGroup: donor.bloodGroup },
            { $inc: { units: units || 1 }, lastUpdated: new Date() },
            { upsert: true, new: true }
        );
        
        res.status(200).json({
            message: 'Appointment completed and donation recorded',
            donation,
            certificateId
        });
    } catch (error) {
        res.status(500).json({ message: 'Error completing appointment', error: error.message });
    }
}

module.exports = {
    // Donor matching
    getMatchingDonors,
    checkDonorEligibility,
    // Donation history
    getDonationHistory,
    recordDonation,
    // Leaderboard
    getLeaderboard,
    getDonorRank,
    // Appointments
    scheduleAppointment,
    getDonorAppointments,
    cancelAppointment,
    getHospitalAppointments,
    completeAppointment
};
