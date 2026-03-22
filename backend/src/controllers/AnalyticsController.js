const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const Request = require('../models/Request');
const Donation = require('../models/Donation');
const BloodStock = require('../models/BloodStock');
const Appointment = require('../models/Appointment');
const { subMonths, startOfMonth, endOfMonth, subDays, startOfDay, endOfDay } = require('date-fns');

/**
 * Get comprehensive analytics for admin dashboard
 */
async function getAnalytics(req, res) {
    try {
        // Basic counts
        const [totalDonors, totalHospitals, totalRequests, totalDonations] = await Promise.all([
            Donor.countDocuments(),
            Hospital.countDocuments(),
            Request.countDocuments(),
            Donation.countDocuments()
        ]);

        // Calculate total units donated
        const donationStats = await Donation.aggregate([
            { $group: { _id: null, totalUnits: { $sum: '$units' } } }
        ]);
        const totalUnitsDonated = donationStats.length > 0 ? donationStats[0].totalUnits : 0;

        // Request status breakdown
        const pendingRequests = await Request.countDocuments({ status: 'pending' });
        const fulfilledRequests = await Request.countDocuments({ status: 'completed' });

        // Monthly donation trends (last 6 months)
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const start = startOfMonth(date);
            const end = endOfMonth(date);
            
            const [donations, requests] = await Promise.all([
                Donation.countDocuments({
                    donationDate: { $gte: start, $lte: end }
                }),
                Request.countDocuments({
                    createdAt: { $gte: start, $lte: end }
                })
            ]);
            
            monthlyData.push({
                month: date.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear(),
                donations,
                requests
            });
        }

        // Blood group distribution of donors
        const bloodGroupDistribution = await Donor.aggregate([
            { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
            { $project: { name: '$_id', value: '$count', _id: 0 } },
            { $sort: { name: 1 } }
        ]);

        // Urgency distribution of requests
        const urgencyDistribution = await Request.aggregate([
            { $group: { _id: '$urgency', count: { $sum: 1 } } },
            { $project: { urgency: '$_id', count: 1, _id: 0 } }
        ]);

        // Donor availability
        const availableDonors = await Donor.countDocuments({ isAvailable: true });
        const unavailableDonors = totalDonors - availableDonors;

        // Recent activity (last 7 days)
        const sevenDaysAgo = subDays(new Date(), 7);
        const [recentDonations, recentRequests, recentDonors] = await Promise.all([
            Donation.countDocuments({ donationDate: { $gte: sevenDaysAgo } }),
            Request.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
            Donor.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
        ]);

        // Low stock alerts count
        const lowStockAlerts = await BloodStock.countDocuments({
            $expr: { $lt: ['$units', '$minThreshold'] }
        });

        // Top cities by donor count
        const topCities = await Donor.aggregate([
            { $group: { _id: '$city', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { city: '$_id', donors: '$count', _id: 0 } }
        ]);

        // Donor level distribution
        const levelDistribution = await Donor.aggregate([
            { $group: { _id: '$level', count: { $sum: 1 } } },
            { $project: { level: '$_id', count: 1, _id: 0 } }
        ]);

        res.status(200).json({
            stats: {
                totalDonors,
                totalHospitals,
                totalRequests,
                totalDonations,
                totalUnitsDonated,
                pendingRequests,
                fulfilledRequests,
                availableDonors,
                unavailableDonors,
                livesSaved: totalUnitsDonated * 3, // Approximately 3 lives per unit
                lowStockAlerts
            },
            recentActivity: {
                donations: recentDonations,
                requests: recentRequests,
                newDonors: recentDonors,
                period: '7 days'
            },
            monthlyData,
            bloodGroupData: bloodGroupDistribution,
            urgencyData: urgencyDistribution,
            topCities,
            levelDistribution
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
}

/**
 * Get blood stock overview across all hospitals
 */
async function getBloodStockOverview(req, res) {
    try {
        // Aggregate blood stock by blood group across all hospitals
        const stockByGroup = await BloodStock.aggregate([
            { 
                $group: { 
                    _id: '$bloodGroup', 
                    totalUnits: { $sum: '$units' },
                    hospitals: { $sum: 1 },
                    lowCount: {
                        $sum: {
                            $cond: [{ $lt: ['$units', '$minThreshold'] }, 1, 0]
                        }
                    }
                } 
            },
            { 
                $project: { 
                    bloodGroup: '$_id', 
                    totalUnits: 1, 
                    hospitals: 1,
                    lowCount: 1,
                    _id: 0 
                } 
            },
            { $sort: { bloodGroup: 1 } }
        ]);

        // Critical shortages (zero units)
        const criticalShortages = await BloodStock.find({ units: 0 })
            .populate('hospital', 'HospitalName City')
            .lean();

        const formattedShortages = criticalShortages.map(s => ({
            hospital: s.hospital?.HospitalName || 'Unknown',
            city: s.hospital?.City || 'Unknown',
            bloodGroup: s.bloodGroup
        }));

        // Total stats
        const totalUnits = stockByGroup.reduce((sum, s) => sum + s.totalUnits, 0);
        const lowStockCount = stockByGroup.reduce((sum, s) => sum + s.lowCount, 0);

        res.status(200).json({
            overview: stockByGroup,
            criticalShortages: formattedShortages,
            summary: {
                totalUnits,
                bloodGroupsTracked: stockByGroup.length,
                lowStockAlerts: lowStockCount,
                criticalCount: formattedShortages.length
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blood stock overview', error: error.message });
    }
}

/**
 * Get donation trends and forecasting
 */
async function getDonationTrends(req, res) {
    try {
        const { months = 12 } = req.query;
        const trendsData = [];

        for (let i = parseInt(months) - 1; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const start = startOfMonth(date);
            const end = endOfMonth(date);

            const [donations, units] = await Promise.all([
                Donation.countDocuments({
                    donationDate: { $gte: start, $lte: end }
                }),
                Donation.aggregate([
                    { $match: { donationDate: { $gte: start, $lte: end } } },
                    { $group: { _id: null, total: { $sum: '$units' } } }
                ])
            ]);

            trendsData.push({
                month: date.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear(),
                donations,
                units: units.length > 0 ? units[0].total : 0
            });
        }

        // Calculate growth rates
        const currentMonth = trendsData[trendsData.length - 1];
        const previousMonth = trendsData[trendsData.length - 2];
        
        const donationGrowth = previousMonth && previousMonth.donations > 0
            ? ((currentMonth.donations - previousMonth.donations) / previousMonth.donations * 100).toFixed(1)
            : 0;

        res.status(200).json({
            trends: trendsData,
            growth: {
                donationGrowth: parseFloat(donationGrowth),
                currentMonth: currentMonth.donations,
                previousMonth: previousMonth?.donations || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donation trends', error: error.message });
    }
}

/**
 * Get request analytics
 */
async function getRequestAnalytics(req, res) {
    try {
        // Requests by urgency
        const byUrgency = await Request.aggregate([
            { $group: { _id: '$urgency', count: { $sum: 1 } } },
            { $project: { urgency: '$_id', count: 1, _id: 0 } }
        ]);

        // Requests by blood group  
        const byBloodGroup = await Request.aggregate([
            { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
            { $project: { bloodGroup: '$_id', count: 1, _id: 0 } },
            { $sort: { bloodGroup: 1 } }
        ]);

        // Requests by city (top 10)
        const byCity = await Request.aggregate([
            { $group: { _id: '$city', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { city: '$_id', count: 1, _id: 0 } }
        ]);

        // Fulfillment rate
        const total = await Request.countDocuments();
        const fulfilled = await Request.countDocuments({ status: 'completed' });
        const fulfillmentRate = total > 0 ? ((fulfilled / total) * 100).toFixed(1) : 0;

        // Average response time (time between request creation and fulfillment)
        const fulfilledRequests = await Request.find({ status: 'completed' }).lean();
        let avgResponseTime = 0;
        if (fulfilledRequests.length > 0) {
            const totalTime = fulfilledRequests.reduce((sum, req) => {
                const diff = new Date(req.updatedAt) - new Date(req.createdAt);
                return sum + diff;
            }, 0);
            avgResponseTime = Math.floor(totalTime / fulfilledRequests.length / (1000 * 60 * 60)); // In hours
        }

        res.status(200).json({
            byUrgency,
            byBloodGroup,
            byCity,
            metrics: {
                total,
                fulfilled,
                pending: total - fulfilled,
                fulfillmentRate: parseFloat(fulfillmentRate),
                avgResponseTimeHours: avgResponseTime
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching request analytics', error: error.message });
    }
}

/**
 * Get quick stats for dashboard cards
 */
async function getQuickStats(req, res) {
    try {
        const today = new Date();
        const startOfToday = startOfDay(today);
        const endOfToday = endOfDay(today);
        const sevenDaysAgo = subDays(today, 7);

        const [
            totalDonors,
            totalRequests,
            pendingRequests,
            todayDonations,
            weekDonations,
            todayAppointments,
            lowStockAlerts
        ] = await Promise.all([
            Donor.countDocuments(),
            Request.countDocuments(),
            Request.countDocuments({ status: 'pending' }),
            Donation.countDocuments({ 
                donationDate: { $gte: startOfToday, $lte: endOfToday } 
            }),
            Donation.countDocuments({ 
                donationDate: { $gte: sevenDaysAgo } 
            }),
            Appointment.countDocuments({ 
                scheduledDate: { $gte: startOfToday, $lte: endOfToday },
                status: { $in: ['scheduled', 'confirmed'] }
            }),
            BloodStock.countDocuments({
                $expr: { $lt: ['$units', '$minThreshold'] }
            })
        ]);

        res.status(200).json({
            totalDonors,
            totalRequests,
            pendingRequests,
            todayDonations,
            weekDonations,
            todayAppointments,
            lowStockAlerts
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quick stats', error: error.message });
    }
}

module.exports = {
    getAnalytics,
    getBloodStockOverview,
    getDonationTrends,
    getRequestAnalytics,
    getQuickStats
};
