const Request = require('../models/Request');
const Hospital = require('../models/Hospital');

const createRequest = async (req, res) => {
    try {
        const { bloodGroup, units, urgency, patientName, city, byDate, purpose, contactName, contactPhone } = req.body;
        const hospitalId = req.user.id;

        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

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
            hospital: hospitalId
        });

        await newRequest.save();
        res.status(201).json({ message: 'Request created successfully', request: newRequest });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { createRequest };
