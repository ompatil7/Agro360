const mongoose = require("mongoose");

const insurancePremiumPaymentSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Farmer reference is required"],
    },
    farmerName: {
      type: String,
    },
    enrollement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FarmVisitTracking",
      required: [true, "Farm Visit Tracking reference is required"],
    },
    insurancePolicy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsurancePolicy",
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
  },
  {
    timestamps: true,
  }
);

const InsurancePremiumPayment = mongoose.model(
  "InsurancePremiumPayment",
  insurancePremiumPaymentSchema
);

module.exports = InsurancePremiumPayment;
