const Request = require('../models/Request');
const Hospital = require('../models/Hospital');
const Requester = require('../models/Requester');

async function createRequest(req, res) {
    const { bloodGroup, units, urgency, patientName, city, byDate, purpose, contactName, contactPhone } = req.body;
    
    try {
        const newRequest = new Request({
            bloodGroup,
            units,
            urgency,
            patientName,
            city,
            byDate,
            purpose,
            contactName,
            contactPhone,
            requester: req.user._id, // Assuming user's ID is in req.user
            requesterModel: req.user.type === 'hospital' ? 'Hospital' : 'Requester'
        });
        
        await newRequest.save();
        res.status(201).json({ message: "Blood request created successfully", request: newRequest });
    } catch (error) {
        res.status(500).json({ message: "Error creating blood request", error: error.message });
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
                statusFrontend = 'Active'; // Map backend 'pending' to frontend 'Active'
            } else if (request.status === 'fulfilled') {
                statusFrontend = 'Fulfilled';
            } else {
                statusFrontend = request.status; // Fallback for other statuses if any
            }

            return {
                ...request.toObject(), // Convert mongoose document to plain object
                status: statusFrontend,
                responses: [], // Mock: Currently no response tracking in model
                fulfilledUnits: request.status === 'fulfilled' ? request.units : 0, // Mock: If fulfilled, assume all units fulfilled
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
                urgency: { $in: [/emergency/i, /urgent/i, /critical/i, /moderate/i] } // Case-insensitive query for common emergency urgency levels, including moderate
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

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status === 'fulfilled') {
            return res.status(400).json({ message: "Request already fulfilled" });
        }

        request.donor = donorId;
        request.status = 'fulfilled'; // For now, we mark it as fulfilled when a donor responds. 
                                      // In a real app, this might involve more steps.
        await request.save();

        res.status(200).json({ message: "Responded to request successfully", request });
    } catch (error) {
        res.status(500).json({ message: "Error responding to request", error: error.message });
    }
}

module.exports = { createRequest, getRequesterRequests, deleteRequest, getEmergencyRequests, respondToRequest };
