const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    reviewBody: { type: String, required: true },
    no_of_stars: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false },
});

module.exports = mongoose.model("Review", reviewSchema);
