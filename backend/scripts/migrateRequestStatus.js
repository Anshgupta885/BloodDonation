/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const Request = require('../src/models/Request');

const APPLY_FLAG = '--apply';

async function run() {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('Missing MONGO_URI (or MONGODB_URI) in environment.');
    }

    const shouldApply = process.argv.includes(APPLY_FLAG);

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const legacyCount = await Request.countDocuments({ status: 'fulfilled' });
    console.log(`Found ${legacyCount} legacy request(s) with status=fulfilled`);

    if (legacyCount === 0) {
        console.log('No migration needed.');
        return;
    }

    if (!shouldApply) {
        console.log('Dry run only. No records were modified.');
        console.log(`Re-run with ${APPLY_FLAG} to apply migration.`);
        return;
    }

    const result = await Request.updateMany(
        { status: 'fulfilled' },
        { $set: { status: 'completed' } }
    );

    console.log(`Migration applied. Modified ${result.modifiedCount} request(s).`);
}

run()
    .catch((error) => {
        console.error('Migration failed:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        try {
            await mongoose.disconnect();
        } catch (_error) {
            // Ignore disconnect errors in shutdown path.
        }
    });
