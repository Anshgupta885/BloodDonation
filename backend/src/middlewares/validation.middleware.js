function requireFields(fields) {
    return (req, res, next) => {
        const missing = fields.filter((field) => {
            const value = req.body[field];
            return value === undefined || value === null || value === '';
        });

        if (missing.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                missing
            });
        }

        return next();
    };
}

function validateEmailAndPassword(req, res, next) {
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(String(email || ''))) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    return next();
}

function validateRequestPayload(req, res, next) {
    const { urgency, units, byDate } = req.body;

    if (!['Critical', 'Urgent', 'Moderate', 'Normal'].includes(urgency)) {
        return res.status(400).json({ message: 'Urgency must be one of Critical/Urgent/Moderate/Normal' });
    }

    const parsedUnits = Number(units);
    if (!Number.isInteger(parsedUnits) || parsedUnits <= 0 || parsedUnits > 10) {
        return res.status(400).json({ message: 'Units must be an integer between 1 and 10' });
    }

    const dueDate = new Date(byDate);
    if (Number.isNaN(dueDate.getTime())) {
        return res.status(400).json({ message: 'Invalid required-by date' });
    }

    return next();
}

module.exports = {
    requireFields,
    validateEmailAndPassword,
    validateRequestPayload
};
