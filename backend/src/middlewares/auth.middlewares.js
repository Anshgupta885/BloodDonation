const jwt = require('jsonwebtoken');

const authMiddleware = (model) => async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
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
    
module.exports = authMiddleware;
