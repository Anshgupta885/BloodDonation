const BloodStock = require('../models/BloodStock');
const Hospital = require('../models/Hospital');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * Initialize blood stock for a hospital (creates entries for all blood groups)
 */
async function initializeBloodStock(req, res) {
    try {
        const hospitalId = req.user._id || req.user.id;
        
        const existingStock = await BloodStock.find({ hospital: hospitalId });
        
        if (existingStock.length > 0) {
            return res.status(200).json({
                message: 'Blood stock already initialized',
                stock: existingStock
            });
        }
        
        const stockEntries = BLOOD_GROUPS.map(bloodGroup => ({
            hospital: hospitalId,
            bloodGroup,
            units: 0,
            minThreshold: 5
        }));
        
        const stock = await BloodStock.insertMany(stockEntries);
        
        res.status(201).json({
            message: 'Blood stock initialized successfully',
            stock
        });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing blood stock', error: error.message });
    }
}

/**
 * Get blood stock for a hospital
 */
async function getBloodStock(req, res) {
    try {
        const hospitalId = req.user._id || req.user.id;
        
        let stock = await BloodStock.find({ hospital: hospitalId });
        
        // If no stock exists, initialize it
        if (stock.length === 0) {
            const stockEntries = BLOOD_GROUPS.map(bloodGroup => ({
                hospital: hospitalId,
                bloodGroup,
                units: 0,
                minThreshold: 5
            }));
            stock = await BloodStock.insertMany(stockEntries);
        }
        
        // Format for frontend
        const formattedStock = stock.map(s => ({
            id: s._id,
            bloodGroup: s.bloodGroup,
            units: s.units,
            minThreshold: s.minThreshold,
            isLow: s.units < s.minThreshold,
            lastUpdated: s.lastUpdated,
            status: s.units === 0 ? 'critical' : s.units < s.minThreshold ? 'low' : 'normal'
        }));
        
        // Summary stats
        const totalUnits = stock.reduce((sum, s) => sum + s.units, 0);
        const lowStockCount = stock.filter(s => s.units < s.minThreshold).length;
        const criticalCount = stock.filter(s => s.units === 0).length;
        
        res.status(200).json({
            stock: formattedStock,
            summary: {
                totalUnits,
                bloodGroupsTracked: stock.length,
                lowStockCount,
                criticalCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blood stock', error: error.message });
    }
}

/**
 * Update blood stock units
 */
async function updateBloodStock(req, res) {
    try {
        const hospitalId = req.user._id || req.user.id;
        const { bloodGroup, units, action } = req.body;
        
        if (!bloodGroup || units === undefined) {
            return res.status(400).json({ message: 'Blood group and units are required' });
        }
        
        if (!BLOOD_GROUPS.includes(bloodGroup)) {
            return res.status(400).json({ message: 'Invalid blood group' });
        }
        
        let stock = await BloodStock.findOne({ hospital: hospitalId, bloodGroup });
        
        if (!stock) {
            stock = new BloodStock({
                hospital: hospitalId,
                bloodGroup,
                units: 0
            });
        }
        
        // Action can be 'set', 'add', or 'subtract'
        switch (action) {
            case 'add':
                stock.units += units;
                break;
            case 'subtract':
                stock.units = Math.max(0, stock.units - units);
                break;
            case 'set':
            default:
                stock.units = Math.max(0, units);
        }
        
        stock.lastUpdated = new Date();
        await stock.save();
        
        res.status(200).json({
            message: 'Blood stock updated successfully',
            stock: {
                bloodGroup: stock.bloodGroup,
                units: stock.units,
                isLow: stock.units < stock.minThreshold,
                lastUpdated: stock.lastUpdated
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating blood stock', error: error.message });
    }
}

/**
 * Update minimum threshold for a blood group
 */
async function updateThreshold(req, res) {
    try {
        const hospitalId = req.user._id || req.user.id;
        const { bloodGroup, minThreshold } = req.body;
        
        if (!bloodGroup || minThreshold === undefined) {
            return res.status(400).json({ message: 'Blood group and threshold are required' });
        }
        
        const stock = await BloodStock.findOneAndUpdate(
            { hospital: hospitalId, bloodGroup },
            { minThreshold },
            { new: true, upsert: true }
        );
        
        res.status(200).json({
            message: 'Threshold updated successfully',
            stock
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating threshold', error: error.message });
    }
}

/**
 * Get low stock alerts for a hospital
 */
async function getLowStockAlerts(req, res) {
    try {
        const hospitalId = req.user._id || req.user.id;
        
        const alerts = await BloodStock.find({
            hospital: hospitalId,
            $expr: { $lt: ['$units', '$minThreshold'] }
        });
        
        const formattedAlerts = alerts.map(alert => ({
            id: alert._id,
            bloodGroup: alert.bloodGroup,
            currentUnits: alert.units,
            minThreshold: alert.minThreshold,
            shortage: alert.minThreshold - alert.units,
            severity: alert.units === 0 ? 'critical' : 'warning'
        }));
        
        res.status(200).json({
            hasAlerts: formattedAlerts.length > 0,
            count: formattedAlerts.length,
            alerts: formattedAlerts
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alerts', error: error.message });
    }
}

/**
 * Get all low stock alerts (admin only)
 */
async function getAllLowStockAlerts(req, res) {
    try {
        const alerts = await BloodStock.getAllLowStockAlerts();
        
        // Group by hospital
        const groupedAlerts = {};
        alerts.forEach(alert => {
            const hospitalId = alert.hospital._id.toString();
            if (!groupedAlerts[hospitalId]) {
                groupedAlerts[hospitalId] = {
                    hospital: {
                        id: alert.hospital._id,
                        name: alert.hospital.HospitalName,
                        city: alert.hospital.City
                    },
                    alerts: []
                };
            }
            groupedAlerts[hospitalId].alerts.push({
                bloodGroup: alert.bloodGroup,
                units: alert.units,
                minThreshold: alert.minThreshold,
                severity: alert.units === 0 ? 'critical' : 'warning'
            });
        });
        
        res.status(200).json({
            totalAlerts: alerts.length,
            hospitalsAffected: Object.keys(groupedAlerts).length,
            alerts: Object.values(groupedAlerts)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alerts', error: error.message });
    }
}

/**
 * Batch update blood stock (for bulk imports)
 */
async function batchUpdateBloodStock(req, res) {
    try {
        const hospitalId = req.user._id || req.user.id;
        const { stockUpdates } = req.body;
        
        if (!stockUpdates || !Array.isArray(stockUpdates)) {
            return res.status(400).json({ message: 'stockUpdates array is required' });
        }
        
        const results = [];
        
        for (const update of stockUpdates) {
            const { bloodGroup, units, minThreshold } = update;
            
            if (!BLOOD_GROUPS.includes(bloodGroup)) continue;
            
            const updateData = { lastUpdated: new Date() };
            if (units !== undefined) updateData.units = Math.max(0, units);
            if (minThreshold !== undefined) updateData.minThreshold = minThreshold;
            
            const stock = await BloodStock.findOneAndUpdate(
                { hospital: hospitalId, bloodGroup },
                updateData,
                { new: true, upsert: true }
            );
            
            results.push(stock);
        }
        
        res.status(200).json({
            message: 'Blood stock batch updated successfully',
            updated: results.length,
            stock: results
        });
    } catch (error) {
        res.status(500).json({ message: 'Error batch updating blood stock', error: error.message });
    }
}

module.exports = {
    initializeBloodStock,
    getBloodStock,
    updateBloodStock,
    updateThreshold,
    getLowStockAlerts,
    getAllLowStockAlerts,
    batchUpdateBloodStock
};
