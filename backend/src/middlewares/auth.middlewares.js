const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const Admin = require('../models/Admin');
const Requester = require('../models/Requester');

const models = {
    donor: Donor,
    hospital: Hospital,
    admin: Admin,
    requester: Requester,
};

const multiTypeAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const model = models[decoded.type];
        if (!model) {
            return res.status(401).json({ message: "Unauthorized: Invalid user type in token" });
        }
        const data = await model.findById(decoded.id).select('-password');
        if (!data) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        
        const user = data.toObject();
        user.type = decoded.type;
        
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

const authMiddleware = (model) => async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const data = await model.findById(decoded.id);
        if (!data) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        req.user = data;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = { authMiddleware, multiTypeAuthMiddleware };
