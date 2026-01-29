const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const Request = require('../models/Request');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');  

dotenv.config();

// Register a new donor
async function registerDonor(req, res) {
    const{Fullname, BloodGroup, email, phone, city, password} = req.body;
    const useralreadyexists=await Donor.findOne({email:email});
    if(useralreadyexists){
        return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDonor = new Donor({
        FullName: Fullname,
        BloodGroup: BloodGroup,
        email: email,
        phone: phone,
        city: city,
        password: hashedPassword
    });
    const token = jwt.sign({ id: newDonor._id }, process.env.JWT_SECRET_KEY);
    res.cookie('token', token);

    await newDonor.save();
    res.status(201).json({message:"Donor registered successfully"});
}   

async function loginDonor(req, res) {
    const { email, password } = req.body;
    const donor = await Donor.findOne({ email: email });
    if (!donor) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, donor.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: donor._id }, process.env.JWT_SECRET_KEY);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: "Login successful" });

}   
 
async function logoutDonor(req, res){
    res.clearCookie('token');
    res.status(200).json({message:"Logged out successfully"});  
}

async function registerHospital(req, res) {
    const{HospitalName, City, address, phone, email, password} = req.body;
    const useralreadyexists=await Hospital.findOne({email:email});
    if(useralreadyexists){
        return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newHospital = new Hospital({
        HospitalName: HospitalName,
        City: City,
        address: address,
        phone: phone,
        email: email,
        password: hashedPassword
    });
    const token = jwt.sign({ id: newHospital._id }, process.env.JWT_SECRET_KEY);
    res.cookie('token', token);
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
    const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET_KEY);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: "Login successful" });
}

async function logoutHospital(req, res){
    res.clearCookie('token');
    res.status(200).json({message:"Logged out successfully"});  
}

async function RegisterRequest(req, res) {
    const{Bloodgroup, Units, urgency, patientName, city, byDate, purpose, ContactName, contactPhone} = req.body;
    const newRequest = new Request({
        Bloodgroup: Bloodgroup,
        Units: Units,
        urgency: urgency,
        patientName: patientName,
        city: city,
        byDate: byDate,
        purpose: purpose,
        ContactName: ContactName,
        contactPhone: contactPhone
    });
    const token = jwt.sign({ id: newRequest._id }, process.env.JWT_SECRET_KEY);
    res.cookie('token', token);
    await newRequest.save();
    res.status(201).json({message:"Request registered successfully"});
}

async function LoginRequest(req, res) {
    const { email, password } = req.body;
    const request = await Request.findOne({ email: email });
    if (!request) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, request.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: request._id }, process.env.JWT_SECRET_KEY);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: "Login successful" });
}

async function logoutRequest(req, res){
    res.clearCookie('token');
    res.status(200).json({message:"Logged out successfully"});  
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
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: "Login successful" });
}

async function logoutAdmin(req, res){   
    res.clearCookie('token');
    res.status(200).json({message:"Logged out successfully"});  
}

async function getDonorDashboard(req, res) {
    res.status(200).json({ message: "Welcome to the donor dashboard" });
}

async function getRequestDashboard(req, res) {
    res.status(200).json({ message: "Welcome to the request dashboard" });
}

async function getHospitalDashboard(req, res) {
    res.status(200).json({ message: "Welcome to the hospital dashboard" });
}

async function getAdminDashboard(req, res) {
    res.status(200).json({ message: "Welcome to the admin dashboard" });
}

module.exports = {
    registerDonor,
    loginDonor,
    logoutDonor,
    registerHospital,
    loginHospital,
    logoutHospital,
    RegisterRequest,
    LoginRequest,
    logoutRequest,
    LoginAdmin,
    logoutAdmin,
    getDonorDashboard,
    getRequestDashboard,
    getHospitalDashboard,
    getAdminDashboard
};