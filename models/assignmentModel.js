const mongoose = require("mongoose");

const insuranceAssignmentSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Farmer reference is required"],
    },
    insurancePolicy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsurancePolicy",
      required: [true, "Insurance policy reference is required"],
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "assigned"],
      default: "pending",
    },
    assignedDate: {
      type: Date,
      default: null,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    visitDate: {
      type: Date,
      default: null,
    },
    region: {
      state: {
        type: String,
        required: [true, "State is required"],
      },
      district: {
        type: String,
        required: [true, "District is required"],
      },
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

insuranceAssignmentSchema.statics.findAvailableAgentsInRegion = async function (
  state,
  district
) {
  const User = require("./userModel");

  return await User.find({
    role: "agent",
    "address.state": state,
    "address.district": district,
  });
};

const InsuranceAssignment = mongoose.model(
  "InsuranceAssignment",
  insuranceAssignmentSchema
);

module.exports = InsuranceAssignment;
