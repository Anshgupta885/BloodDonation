const Donor = require('../models/Donor');
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


module.exports = {
    registerDonor, 
    loginDonor,
    logoutDonor,
    registerHospital,
    loginHospital,
    logoutHospital
};