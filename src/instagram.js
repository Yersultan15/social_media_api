const mongoose = require('mongoose');

const InstagramQuerySchema = new mongoose.Schema({
    timestamp: String,
    userID: String,
    username: String,
    isPrivate: Boolean,
    fullName: String,
    // Add more properties as needed
});

const InstagramQuery = mongoose.model('InstagramQuery', InstagramQuerySchema);

module.exports = InstagramQuery;
