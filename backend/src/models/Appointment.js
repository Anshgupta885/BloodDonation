const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    donor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Donor', 
        required: true 
    },
    hospital: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hospital', 
        required: true 
    },
    scheduledDate: { 
        type: Date, 
        required: true 
    },
    timeSlot: { 
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'], 
        default: 'scheduled' 
    },
    notes: { 
        type: String 
    },
    donationType: {
        type: String,
        enum: ['whole-blood', 'plasma', 'platelets'],
        default: 'whole-blood'
    },
    reminder: {
        sent: { type: Boolean, default: false },
        sentAt: { type: Date }
    }
}, { timestamps: true });

// Index for efficient queries
AppointmentSchema.index({ donor: 1, scheduledDate: 1 });
AppointmentSchema.index({ hospital: 1, scheduledDate: 1 });
AppointmentSchema.index({ status: 1, scheduledDate: 1 });

// Static method to get upcoming appointments for a donor
AppointmentSchema.statics.getUpcomingForDonor = async function(donorId) {
    return this.find({
        donor: donorId,
        scheduledDate: { $gte: new Date() },
        status: { $in: ['scheduled', 'confirmed'] }
    }).populate('hospital', 'HospitalName City address').sort({ scheduledDate: 1 });
};

// Static method to get appointments for a hospital on a specific date
AppointmentSchema.statics.getHospitalAppointments = async function(hospitalId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.find({
        hospital: hospitalId,
        scheduledDate: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ['scheduled', 'confirmed'] }
    }).populate('donor', 'name bloodGroup phone email').sort({ scheduledDate: 1 });
};

const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
