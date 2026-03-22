const donor=require('../models/Donor');
const Hospital=require('../models/Hospital');
const Requester=require('../models/Requester');
const admin=require('../models/Admin');
const jwt=require('jsonwebtoken');

async function updateDonorDetails(req,res){
    try{
        const token=req.headers.authorization.split(' ')[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        const donorId=decoded.id;
        const {name,age,phone,city,pincode,bloodGroup}=req.body;
        const updatedDonor=await donor.findByIdAndUpdate(donorId,
            {name,age,phone,city,pincode,bloodGroup},
            {new:true}
        ).select('-password');
        if(!updatedDonor){
            return res.status(404).json({message:'Donor not found'});
        }
        res.status(200).json({message:'Profile updated successfully',donor:updatedDonor});
    }catch(error){
        res.status(500).json({message:'Error updating profile',error:error.message});
    }
}
 async function updateHospitalDetails(req,res){
    try{
        const token=req.headers.authorization.split(' ')[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        const hospitalId=decoded.id;
        const {HospitalName,phone,address, City,pincode}=req.body;
        const updatedHospital=await Hospital.findByIdAndUpdate(hospitalId,
            {HospitalName,phone,address, City,pincode},
            {new:true}
        ).select('-password');  
        if(!updatedHospital){
            return res.status(404).json({message:'Hospital not found'});
        }
        res.status(200).json({message:'Profile updated successfully',hospital:updatedHospital});
    }catch(error){
        res.status(500).json({message:'Error updating profile',error:error.message});
    }   
}
 async function updateRequesterDetails(req,res){
    try{
        const token=req.headers.authorization.split(' ')[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        const requesterId=decoded.id;
        const {name,age,phone,address,pincode,roleAlias}=req.body;
        const updatedRequester=await Requester.findByIdAndUpdate(requesterId,
            {name,age,phone,address,pincode,roleAlias},
            {new:true}
        ).select('-passwordHash');
        if(!updatedRequester){
            return res.status(404).json({message:'Requester not found'});
        }
        res.status(200).json({message:'Profile updated successfully',requester:updatedRequester});
    }catch(error){
        res.status(500).json({message:'Error updating profile',error:error.message});
    }   
}
    async function updateAdminDetails(req,res){
    try{
        const token=req.headers.authorization.split(' ')[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        const adminId=decoded.id;
        const {name,phone}=req.body;
        const updatedAdmin=await admin.findByIdAndUpdate(adminId,
            {name,phone},
            {new:true}
        ).select('-password');
        if(!updatedAdmin){
            return res.status(404).json({message:'Admin not found'});
        }
        res.status(200).json({message:'Profile updated successfully',admin:updatedAdmin});
    }catch(error){
        res.status(500).json({message:'Error updating profile',error:error.message});
    }
}

module.exports={updateDonorDetails, updateHospitalDetails, updateRequesterDetails, updateAdminDetails};