const mongoose = require('mongoose');

const BloodStockSchema = new mongoose.Schema({
    hospital: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hospital', 
        required: true 
    },
    bloodGroup: { 
        type: String, 
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    units: { 
        type: Number, 
        default: 0,
        min: 0
    },
    minThreshold: { 
        type: Number, 
        default: 5 // Alert when stock falls below this
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Compound index for unique blood group per hospital
BloodStockSchema.index({ hospital: 1, bloodGroup: 1 }, { unique: true });

// Virtual to check if stock is low
BloodStockSchema.virtual('isLow').get(function() {
    return this.units < this.minThreshold;
});

// Static method to get low stock alerts for a hospital
BloodStockSchema.statics.getLowStockAlerts = async function(hospitalId) {
    return this.find({
        hospital: hospitalId,
        $expr: { $lt: ['$units', '$minThreshold'] }
    });
};

// Static method to get all low stock alerts (for admin)
BloodStockSchema.statics.getAllLowStockAlerts = async function() {
    return this.find({
        $expr: { $lt: ['$units', '$minThreshold'] }
    }).populate('hospital', 'HospitalName City');
};

const BloodStock = mongoose.model('BloodStock', BloodStockSchema);
module.exports = BloodStock;
