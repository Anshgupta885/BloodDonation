const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const Request = require('../models/Request');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { subMonths, startOfMonth, endOfMonth, startOfDay, endOfDay } = require('date-fns');

dotenv.config();

// ... (registerDonor, logoutDonor, registerHospital, loginHospital, logoutHospital functions remain the same)
async function registerDonor(req, res) {
    const{ name, bloodGroup, email, phone, city, password} = req.body;
    const useralreadyexists=await Donor.findOne({email:email});
    if(useralreadyexists){
        return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDonor = new Donor({
        name: name,
        bloodGroup: bloodGroup,
        email: email,
        phone: phone,
        city: city,
        password: hashedPassword
    });

    await newDonor.save();
    res.status(201).json({message:"Donor registered successfully"});
}

async function loginDonor(req, res) {
    console.log('Login attempt received:', req.body);
    const { email, password } = req.body;
    const donor = await Donor.findOne({ email: email });
    console.log('Donor found in DB:', donor);
    if (!donor) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log('Stored hashed password:', donor.password);
    const isPasswordValid = await bcrypt.compare(password, donor.password);
    console.log('Password validation result:', isPasswordValid);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: donor._id, type: 'donor' }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    const user = { id: donor._id, name: donor.name, email: donor.email, type: 'donor', bloodGroup: donor.bloodGroup };
    res.status(200).json({ message: "Login successful", token, user });
}

async function logoutDonor(req, res){
    res.status(200).json({message:"Logged out successfully"});
}

async function registerHospital(req, res) {
    const{ name, city, address, phone, email, password} = req.body;
    const useralreadyexists=await Hospital.findOne({email:email});
    if(useralreadyexists){
        return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newHospital = new Hospital({
        HospitalName: name,
        City: city,
        address: address,
        phone: phone,
        email: email,
        password: hashedPassword
    });
    await newHospital.save();
    res.status(201).json({message:"Hospital registered successfully"});
}

async function loginHospital(req, res) {
    const { email, password } = req.body;
    const hospital = await Hospital.findOne({ email: email });
    if (!hospital) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, hospital.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: hospital._id, type: 'hospital' }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    const user = { id: hospital._id, name: hospital.HospitalName, email: hospital.email, type: 'hospital' };
    res.status(200).json({ message: "Login successful", token, user });
}

async function logoutHospital(req, res){
    res.status(200).json({message:"Logged out successfully"});
}


async function createRequest(req, res) {
    const { bloodGroup, units, urgency, patientName, city, byDate, purpose, contactName, contactPhone } = req.body;
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
        hospital: req.user.id,
    });
    await newRequest.save();
    res.status(201).json({ message: "Request created successfully" });
}

async function registerAdmin(req, res) {
    const { email, password, secretKey } = req.body;
    
    // Require a secret key for admin registration for security
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ message: "Invalid admin secret key" });
    }
    
    const adminAlreadyExists = await Admin.findOne({ email: email });
    if (adminAlreadyExists) {
        return res.status(400).json({ message: "Admin already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
        email: email,
        password: hashedPassword
    });
    
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
}

async function LoginAdmin(req, res) {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: admin._id, type: 'admin' }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    const user = { id: admin._id, name: 'Admin', email: admin.email, type: 'admin' };
    res.status(200).json({ message: "Login successful", token, user });
}

async function logoutAdmin(req, res) {
    res.status(200).json({ message: "Logged out successfully" });
}

async function getDonorDashboard(req, res) {
    try {
        const donor = await Donor.findById(req.user.id).select('-password');
        if (!donor) {
            return res.status(404).json({ message: "Donor not found" });
        }

        const stats = {
            totalDonations: 12,
            livesSaved: 36,
            lastDonation: '45 days ago',
            nextEligible: 'in 15 days',
        };

        const emergencyRequests = [
            { id: 1, hospital: 'City General Hospital', bloodGroup: 'O+', units: 2, distance: '2.3 km', urgency: 'Critical', time: '15 mins ago' },
            { id: 2, hospital: 'St. Mary Medical Center', bloodGroup: 'A+', units: 1, distance: '4.1 km', urgency: 'Urgent', time: '1 hour ago' },
        ];

        res.status(200).json({ donor, stats, emergencyRequests });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donor dashboard data', error });
    }
}

async function toggleDonorAvailability(req, res) {
    try {
        const donor = await Donor.findById(req.user.id);
        if (!donor) {
            return res.status(404).json({ message: "Donor not found" });
        }
        donor.isAvailable = !donor.isAvailable;
        await donor.save();
        res.status(200).json({ message: 'Availability updated successfully', isAvailable: donor.isAvailable });
    } catch (error) {
        res.status(500).json({ message: 'Error updating availability', error });
    }
}

async function getHospitalDashboard(req, res) {
    try {
        const hospitalId = req.user.id;
        const today = new Date();

        const activeRequests = await Request.find({ hospital: hospitalId, status: 'pending' }).sort({ createdAt: -1 });
        const fulfilledRequests = await Request.find({ hospital: hospitalId, status: 'fulfilled' }).populate('donor', 'name').sort({ updatedAt: -1 });

        const stats = {
            activeRequests: activeRequests.length,
            fulfilledToday: await Request.countDocuments({ hospital: hospitalId, status: 'fulfilled', updatedAt: { $gte: startOfDay(today), $lte: endOfDay(today) } }),
            totalDonors: 156, // Mock
            unitsCollected: fulfilledRequests.reduce((acc, req) => acc + req.units, 0),
        };

        res.status(200).json({ activeRequests, fulfilledRequests, stats });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hospital dashboard data', error });
    }
}


async function getAdminDashboard(req, res) {
    try {
        const totalDonors = await Donor.countDocuments();
        const totalHospitals = await Hospital.countDocuments();
        const totalRequests = await Request.countDocuments();
        const totalUnitsDonated = 0; // Placeholder

        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            monthlyData.push({
                month: date.toLocaleString('default', { month: 'short' }),
                donations: Math.floor(Math.random() * 1000) + 500, // Mock data
            });
        }

        const bloodGroupDistribution = await Donor.aggregate([
            { $group: { _id: '$bloodGroup', value: { $sum: 1 } } },
            { $project: { name: '$_id', value: 1, _id: 0 } }
        ]);

        const recentActivities = [
            { id: 1, type: 'donor', message: 'New donor registered: John Smith', time: '5 mins ago', status: 'success' },
            { id: 2, type: 'hospital', message: 'City Hospital created urgent blood request', time: '15 mins ago', status: 'warning' },
            { id: 3, type: 'donation', message: 'Donation completed at Memorial Hospital', time: '1 hour ago', status: 'success' },
        ]; // Mock data

        res.status(200).json({
            stats: {
                totalDonors,
                totalHospitals,
                totalRequests,
                totalUnitsDonated,
            },
            monthlyData,
            bloodGroupData: bloodGroupDistribution,
            recentActivities
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data', error });
    }
}

async function getMe(req, res) {
    const userData = req.user;
    // Normalize user data to match login response format
    const user = {
        id: userData._id || userData.id,
        email: userData.email,
        type: userData.type,
    };
    
    // Add type-specific fields
    if (userData.type === 'donor') {
        user.name = userData.name;
        user.bloodGroup = userData.bloodGroup;
    } else if (userData.type === 'hospital') {
        user.name = userData.HospitalName || userData.name;
    } else if (userData.type === 'admin') {
        user.name = 'Admin';
    }
    
    res.status(200).json({ user });
}

module.exports = {
    registerDonor,
    loginDonor,
    logoutDonor,
    registerHospital,
    loginHospital,
    logoutHospital,
    createRequest,
    registerAdmin,
    LoginAdmin,
    logoutAdmin,
    getDonorDashboard,
    toggleDonorAvailability,
    getHospitalDashboard,
    getAdminDashboard,
    getMe
};