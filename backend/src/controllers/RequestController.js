const Request = require('../models/Request');
const Hospital = require('../models/Hospital');

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
            requester: req.user.id, // Assuming user's ID is in req.user
            requesterModel: req.user.type === 'hospital' ? 'Hospital' : 'Requester'
        });
        
        await newRequest.save();
        res.status(201).json({ message: "Blood request created successfully", request: newRequest });
    } catch (error) {
        res.status(500).json({ message: "Error creating blood request", error: error.message });
    }
}

module.exports = { createRequest };
