const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        if (db) console.log('MongoDB Connected');
    } catch (error) {
        console.error(error.message);
    }
};

module.exports = connectDB;
