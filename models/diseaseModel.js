const mongoose = require("mongoose");

// Create disease schema
const diseaseSchema = new mongoose.Schema({
  name: String,
  cropAffected: String,
  scientificName: String,
  detailedDescription: String,
  symptoms: [String],
  causes: [String],
  prevention: [String],
  treatment: {
    chemical: [String],
    organic: [String],
    cultural: [String],
  },
  recommendedProducts: [String],
  spreadingConditions: [String],
});
const Disease = mongoose.model("Disease", diseaseSchema);
module.exports = Disease;
