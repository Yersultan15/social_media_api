const mongoose = require('mongoose');

const TikTokSchema = new mongoose.Schema({
    timestamp: String,
    videoLink: String,
    // Add more properties as needed
});

const TikTok = mongoose.model('TikTok', TikTokSchema);

module.exports = TikTok;
