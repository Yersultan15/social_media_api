const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        en: String,  // English name
        es: String,  // Spanish name
        // Add more languages as needed
    },
    description: {
        en: String,  // English description
        es: String,  // Spanish description
        // Add more languages as needed
    },
    images: [String],  // Array of image URLs
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
