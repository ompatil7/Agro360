const mongoose = require("mongoose");

const policyEnrollmentSchema = new mongoose.Schema(
  {
    insuranceAssignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsuranceAssignment",
      required: [true, "Insurance assignment reference is required"],
    },
    farmVisit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FarmVisit",
      required: [true, "Farm visit reference is required"],
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Farmer reference is required"],
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Agent reference is required"],
    },
    insurancePolicy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsurancePolicy",
      required: [true, "Insurance policy reference is required"],
    },
    policyDetails: {
      policyName: String,
      policyNumber: String,
      sumInsured: Number,
      premium: Number,
      seasonDates: {
        startDate: Date,
        endDate: Date,
      },
    },

    cropDetails: [
      {
        cropCategory: String,
        crops: [
          {
            cropType: String,
            thresholds: {
              temperature: {
                minTemperature: Number,
                maxTemperature: Number,
              },
              rainfall: {
                minRainfall: Number,
                maxRainfall: Number,
              },
              humidity: {
                minHumidity: Number,
                maxHumidity: Number,
              },
            },
          },
        ],
      },
    ],
    farmDetails: {
      areaSize: Number,
      irrigationType: String,
      geolocation: {
        type: { type: String, enum: ["Point"] },
        coordinates: [Number],
      },
      radius: Number,
    },
    farmerDetails: {
      name: String,
      email: String,
      phone: String,
      address: {
        state: String,
        district: String,
      },
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    payment: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
policyEnrollmentSchema.index({ "farmDetails.geolocation": "2dsphere" });
const PolicyEnrollment = mongoose.model(
  "PolicyEnrollment",
  policyEnrollmentSchema
);

module.exports = PolicyEnrollment;
