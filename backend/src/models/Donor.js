const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, min: 18, max: 65 },
    bloodGroup: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    profilePicture: { type: String, default: null },
    // New fields for eligibility and leaderboard
    lastDonationDate: { type: Date, default: null },
    donationCount: { type: Number, default: 0 },
    reputationScore: { type: Number, default: 0 },
    level: { 
        type: String, 
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], 
        default: 'Bronze' 
    },
    // Location coordinates for distance-based matching (optional)
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    }
});

// Index for geospatial queries (optional)
DonorSchema.index({ location: '2dsphere' });

// Constants for eligibility (in days)
const ELIGIBILITY_PERIOD_DAYS = 90; // 3 months

// Virtual to check if donor is eligible based on last donation date
DonorSchema.virtual('isEligible').get(function() {
    if (!this.lastDonationDate) return true;
    const daysSinceLastDonation = Math.floor(
        (Date.now() - this.lastDonationDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceLastDonation >= ELIGIBILITY_PERIOD_DAYS;
});

// Virtual to get days until eligible
DonorSchema.virtual('daysUntilEligible').get(function() {
    if (!this.lastDonationDate) return 0;
    const daysSinceLastDonation = Math.floor(
        (Date.now() - this.lastDonationDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysRemaining = ELIGIBILITY_PERIOD_DAYS - daysSinceLastDonation;
    return Math.max(0, daysRemaining);
});

// Virtual to get next eligible date
DonorSchema.virtual('nextEligibleDate').get(function() {
    if (!this.lastDonationDate) return null;
    const nextDate = new Date(this.lastDonationDate);
    nextDate.setDate(nextDate.getDate() + ELIGIBILITY_PERIOD_DAYS);
    return nextDate;
});

// Method to update level based on donation count
DonorSchema.methods.updateLevel = function() {
    if (this.donationCount >= 50) this.level = 'Diamond';
    else if (this.donationCount >= 25) this.level = 'Platinum';
    else if (this.donationCount >= 15) this.level = 'Gold';
    else if (this.donationCount >= 5) this.level = 'Silver';
    else this.level = 'Bronze';
    return this.level;
};

// Method to record a new donation
DonorSchema.methods.recordDonation = async function() {
    this.lastDonationDate = new Date();
    this.donationCount += 1;
    this.reputationScore += 10; // Base score per donation
    this.updateLevel();
    return this.save();
};

// Static method to find eligible donors by blood group
DonorSchema.statics.findEligibleDonors = async function(bloodGroup, city = null, pincode = null) {
    const eligibilityDate = new Date();
    eligibilityDate.setDate(eligibilityDate.getDate() - ELIGIBILITY_PERIOD_DAYS);
    
    const query = {
        bloodGroup,
        isAvailable: true,
        isBlocked: false,
        $or: [
            { lastDonationDate: null },
            { lastDonationDate: { $lte: eligibilityDate } }
        ]
    };
    
    if (city) {
        query.city = { $regex: city, $options: 'i' };
    }

    if (pincode) {
        query.pincode = String(pincode);
    }
    
    return this.find(query).select('-password');
};

// Ensure virtuals are included when converting to JSON
DonorSchema.set('toJSON', { virtuals: true });
DonorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Donor', DonorSchema);
