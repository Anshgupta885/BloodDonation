const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    donor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Donor', 
        required: true 
    },
    request: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Request' 
    },
    hospital: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hospital' 
    },
    hospitalName: { 
        type: String 
    },
    bloodGroup: { 
        type: String, 
        required: true 
    },
    units: { 
        type: Number, 
        default: 1 
    },
    donationDate: { 
        type: Date, 
        default: Date.now 
    },
    location: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ['scheduled', 'completed', 'cancelled'], 
        default: 'completed' 
    },
    certificateId: { 
        type: String 
    },
    notes: { 
        type: String 
    }
}, { timestamps: true });

// Index for efficient queries
DonationSchema.index({ donor: 1, donationDate: -1 });
DonationSchema.index({ hospital: 1, donationDate: -1 });

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;
