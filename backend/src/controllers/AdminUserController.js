const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const Requester = require('../models/Requester');
const Admin = require('../models/Admin');

const modelByType = {
    donor: Donor,
    hospital: Hospital,
    requester: Requester,
    admin: Admin
};

async function listUsers(req, res) {
    try {
        const { type = 'all', q = '' } = req.query;
        const normalizedType = String(type).toLowerCase();

        const runQuery = async (label, Model, nameField) => {
            const query = {};
            if (q) {
                query.$or = [
                    { email: { $regex: q, $options: 'i' } },
                    { [nameField]: { $regex: q, $options: 'i' } }
                ];
            }

            const users = await Model.find(query).select('-password -passwordHash').lean();
            return users.map((user) => ({
                id: user._id,
                type: label,
                name: user[nameField] || (label === 'admin' ? 'Admin' : 'Unknown'),
                email: user.email,
                city: user.city || user.City || null,
                pincode: user.pincode || null,
                isBlocked: Boolean(user.isBlocked),
                createdAt: user.createdAt || null
            }));
        };

        if (normalizedType !== 'all' && !modelByType[normalizedType]) {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        let data = [];
        if (normalizedType === 'all' || normalizedType === 'donor') {
            data = data.concat(await runQuery('donor', Donor, 'name'));
        }
        if (normalizedType === 'all' || normalizedType === 'hospital') {
            data = data.concat(await runQuery('hospital', Hospital, 'HospitalName'));
        }
        if (normalizedType === 'all' || normalizedType === 'requester') {
            data = data.concat(await runQuery('requester', Requester, 'name'));
        }
        if (normalizedType === 'all' || normalizedType === 'admin') {
            data = data.concat(await runQuery('admin', Admin, 'email'));
        }

        return res.status(200).json({ count: data.length, users: data });
    } catch (error) {
        return res.status(500).json({ message: 'Error listing users', error: error.message });
    }
}

async function setBlockedStatus(req, res) {
    try {
        const { type, id } = req.params;
        const { isBlocked } = req.body;

        const normalizedType = String(type).toLowerCase();
        const Model = modelByType[normalizedType];

        if (!Model) {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        if (typeof isBlocked !== 'boolean') {
            return res.status(400).json({ message: 'isBlocked must be boolean' });
        }

        const updated = await Model.findByIdAndUpdate(
            id,
            { isBlocked },
            { new: true }
        ).select('-password -passwordHash');

        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
            user: updated
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user status', error: error.message });
    }
}

module.exports = {
    listUsers,
    setBlockedStatus
};
