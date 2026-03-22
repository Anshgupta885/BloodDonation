const Request = require('../models/Request');
const Hospital = require('../models/Hospital');
const Requester = require('../models/Requester');
const Donor = require('../models/Donor');
const { sendRequestCreatedEmail, sendEmergencyBroadcastEmail, sendDonorApprovalEmail } = require('../services/emailService');

// Constants for eligibility
const ELIGIBILITY_PERIOD_DAYS = 90;

async function createRequest(req, res) {
    const { bloodGroup, units, urgency, patientName, city, pincode, byDate, purpose, contactName, contactPhone } = req.body;

    if (!bloodGroup || !units || !urgency || !patientName || !city || !byDate || !purpose || !contactName || !contactPhone) {
        return res.status(400).json({ message: 'Missing required request fields' });
    }

    if (!['Critical', 'Urgent', 'Moderate', 'Normal'].includes(urgency)) {
        return res.status(400).json({ message: 'Invalid urgency value' });
    }

    if (!Number.isInteger(units) || units <= 0) {
        return res.status(400).json({ message: 'Units must be a positive integer' });
    }
    
    try {
        const newRequest = new Request({
            bloodGroup,
            units,
            urgency,
            patientName,
            city,
            pincode,
            byDate,
            purpose,
            contactName,
            contactPhone,
            requester: req.user._id, // Assuming user's ID is in req.user
            requesterModel: req.user.type === 'hospital' ? 'Hospital' : 'Requester'
        });
        
        await newRequest.save();

        // Send email notification to requester (async, don't wait)
        const requesterEmail = req.user.email;
        if (requesterEmail) {
            sendRequestCreatedEmail(requesterEmail, {
                patientName,
                bloodGroup,
                units,
                urgency,
                city,
                byDate
            }).catch(err => console.error('Email notification failed:', err));
        }

        // For urgent/critical requests, automatically broadcast to eligible donors
        if (urgency === 'Critical' || urgency === 'Urgent') {
            broadcastToEligibleDonors(newRequest, req.user).catch(err => 
                console.error('Emergency broadcast failed:', err)
            );
        }

        res.status(201).json({ message: "Blood request created successfully", request: newRequest });
    } catch (error) {
        res.status(500).json({ message: "Error creating blood request", error: error.message });
    }
}

/**
 * Broadcast emergency request to eligible donors
 */
async function broadcastToEligibleDonors(request, requester) {
    try {
        const eligibilityDate = new Date();
        eligibilityDate.setDate(eligibilityDate.getDate() - ELIGIBILITY_PERIOD_DAYS);

        // Find eligible donors matching blood group
        const eligibleDonors = await Donor.find({
            bloodGroup: request.bloodGroup,
            isAvailable: true,
            $or: [
                { lastDonationDate: null },
                { lastDonationDate: { $lte: eligibilityDate } }
            ]
        }).select('email name');

        if (eligibleDonors.length === 0) {
            console.log('No eligible donors found for broadcast');
            return { sent: 0, total: 0 };
        }

        const donorEmails = eligibleDonors.map(d => d.email).filter(Boolean);
        
        const requestDetails = {
            patientName: request.patientName,
            bloodGroup: request.bloodGroup,
            units: request.units,
            urgency: request.urgency,
            city: request.city,
            contactPhone: request.contactPhone,
            hospital: requester.HospitalName || requester.name || 'Blood Request'
        };

        const result = await sendEmergencyBroadcastEmail(donorEmails, requestDetails);
        console.log(`Emergency broadcast sent: ${result.sent}/${result.total} donors`);
        return result;
    } catch (error) {
        console.error('Error in emergency broadcast:', error);
        throw error;
    }
}

/**
 * Manually trigger emergency broadcast for a request
 */
async function sendEmergencyBroadcast(req, res) {
    try {
        const requestId = req.params.id;
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Authorization check
        if (request.requester.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to broadcast this request" });
        }

        if (request.status === 'completed' || request.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot broadcast a closed request' });
        }

        const result = await broadcastToEligibleDonors(request, req.user);

        res.status(200).json({
            message: "Emergency broadcast sent",
            donorsNotified: result.sent,
            totalEligible: result.total
        });
    } catch (error) {
        res.status(500).json({ message: "Error sending broadcast", error: error.message });
    }
}

async function getRequesterRequests(req, res) {
    try {
        const requests = await Request.find({ 
            requester: req.user._id, 
            requesterModel: req.user.type === 'hospital' ? 'Hospital' : 'Requester' // Dynamically set based on user type
        })
        .populate('donor', 'name') // Populate donor's name
        .sort({ createdAt: -1 });

        const formattedRequests = requests.map(request => {
            let statusFrontend;
            if (request.status === 'pending') {
                statusFrontend = 'Pending';
            } else if (request.status === 'accepted') {
                statusFrontend = 'Accepted';
            } else if (request.status === 'completed') {
                statusFrontend = 'Completed';
            } else if (request.status === 'cancelled') {
                statusFrontend = 'Cancelled';
            } else if (request.status === 'fulfilled') {
                // Backward compatibility if old records still exist.
                statusFrontend = 'Fulfilled';
            } else {
                statusFrontend = request.status; // Fallback for other statuses if any
            }

            return {
                ...request.toObject(), // Convert mongoose document to plain object
                status: statusFrontend,
                responses: [], // Mock: Currently no response tracking in model
                fulfilledUnits: request.status === 'completed' ? request.units : 0,
                donorName: request.donor ? request.donor.name : undefined, // Populate donor name if available
            };
        });

        res.status(200).json(formattedRequests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching requester's blood requests", error: error.message });
    }
}

async function deleteRequest(req, res) {
    try {
        const requestId = req.params.id;
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Authorization: Ensure the logged-in user is the requester of this request
        if (request.requester.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this request" });
        }

        await Request.deleteOne({ _id: requestId });
        res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
        console.error("Error deleting blood request:", error);
        res.status(500).json({ message: "Error deleting blood request", error: error.message });
    }
}


async function getEmergencyRequests(req, res) {
    try {
        const emergencyRequests = await Request.find({ 
                urgency: { $in: [/emergency/i, /urgent/i, /critical/i, /moderate/i] },
                status: { $in: ['pending', 'accepted'] }
            })
            .populate({
                path: 'requester',
                select: 'name' // Select the fields you need from the requester
            })
            .sort({ createdAt: -1 });

        console.log("Emergency Requests from DB:", emergencyRequests); // Log the fetched requests

        res.status(200).json(emergencyRequests);
    } catch (error) {
        console.error("Error fetching emergency requests:", error); // Log the error
        res.status(500).json({ message: "Error fetching emergency requests", error: error.message });
    }
}

async function respondToRequest(req, res) {
    try {
        const requestId = req.params.id;
        const donorId = req.user._id;

        const request = await Request.findById(requestId).populate('requester');
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status === 'completed' || request.status === 'cancelled') {
            return res.status(400).json({ message: 'Request is already closed' });
        }

        // Get donor info
        const donor = await Donor.findById(donorId).select('name email isEligible daysUntilEligible nextEligibleDate isBlocked');
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }
        if (donor.isBlocked) {
            return res.status(403).json({ message: 'Your account is blocked' });
        }
        if (!donor.isEligible) {
            return res.status(400).json({
                message: 'Donor is not eligible yet (minimum 90 days since last donation)',
                daysUntilEligible: donor.daysUntilEligible,
                nextEligibleDate: donor.nextEligibleDate
            });
        }

        request.donor = donorId;
        request.status = 'accepted';
        await request.save();

        // Send confirmation email to donor (async)
        if (donor && donor.email) {
            const requestDetails = {
                patientName: request.patientName,
                bloodGroup: request.bloodGroup,
                hospital: request.requester?.HospitalName || request.requester?.name || 'Blood Donation Center',
                city: request.city,
                contactPhone: request.contactPhone
            };
            sendDonorApprovalEmail(donor.email, donor.name, requestDetails).catch(err => 
                console.error('Donor approval email failed:', err)
            );
        }

        res.status(200).json({ message: "Responded to request successfully", request });
    } catch (error) {
        res.status(500).json({ message: "Error responding to request", error: error.message });
    }
}

async function completeRequest(req, res) {
    try {
        const requestId = req.params.id;
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const requesterId = request.requester?.toString();
        const actorId = req.user._id.toString();
        const actorType = req.user.type;
        const isOwner = requesterId === actorId;
        const isAdmin = actorType === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Unauthorized to complete this request' });
        }

        if (request.status === 'completed') {
            return res.status(400).json({ message: 'Request already completed' });
        }

        request.status = 'completed';
        await request.save();

        return res.status(200).json({ message: 'Request marked as completed', request });
    } catch (error) {
        return res.status(500).json({ message: 'Error completing request', error: error.message });
    }
}

async function getPublicCriticalRequests(req, res) {
    try {
        const requests = await Request.find({
            urgency: { $in: ['Critical', 'Urgent'] },
            status: { $in: ['pending', 'accepted'] }
        })
            .select('bloodGroup units urgency city pincode byDate createdAt patientName')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        return res.status(200).json({ requests });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching critical requests', error: error.message });
    }
}

module.exports = { 
    createRequest, 
    getRequesterRequests, 
    deleteRequest, 
    getEmergencyRequests, 
    respondToRequest,
    sendEmergencyBroadcast,
    completeRequest,
    getPublicCriticalRequests
};
