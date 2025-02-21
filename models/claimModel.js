const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  policyEnrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PolicyEnrollment",
    required: true,
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Farmer reference is required"],
  },
  photos: [String],
  geolocation: {
    type: { type: String, enum: ["Point"] },
    coordinates: [Number],
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  note: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Claim = mongoose.model("Claim", claimSchema);

module.exports = Claim;
