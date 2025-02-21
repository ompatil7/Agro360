const mongoose = require("mongoose");
const capitalizeWords = (str) => (str ? str.toUpperCase().trim() : str);

const cropThresholds = {
  Cereals: {
    Wheat: {
      temperature: { min: 10, max: 25 },
      humidity: { min: 50, max: 70 },
      rainfall: { min: 500, max: 1200 },
    },
    Rice: {
      temperature: { min: 20, max: 35 },
      humidity: { min: 70, max: 90 },
      rainfall: { min: 1000, max: 2500 },
    },
    Maize: {
      temperature: { min: 18, max: 32 },
      humidity: { min: 50, max: 80 },
      rainfall: { min: 500, max: 800 },
    },
    Barley: {
      temperature: { min: 12, max: 25 },
      humidity: { min: 40, max: 60 },
      rainfall: { min: 300, max: 600 },
    },
    Sorghum: {
      temperature: { min: 25, max: 35 },
      humidity: { min: 50, max: 70 },
      rainfall: { min: 400, max: 600 },
    },
  },
  Pulses: {
    Chickpea: {
      temperature: { min: 15, max: 30 },
      humidity: { min: 40, max: 50 },
      rainfall: { min: 300, max: 600 },
    },
    Lentil: {
      temperature: { min: 18, max: 28 },
      humidity: { min: 50, max: 60 },
      rainfall: { min: 400, max: 700 },
    },
    Pea: {
      temperature: { min: 10, max: 25 },
      humidity: { min: 50, max: 70 },
      rainfall: { min: 500, max: 1000 },
    },
    PigeonPea: {
      temperature: { min: 20, max: 35 },
      humidity: { min: 50, max: 75 },
      rainfall: { min: 600, max: 1200 },
    },
  },
  Oilseeds: {
    Mustard: {
      temperature: { min: 10, max: 25 },
      humidity: { min: 40, max: 60 },
      rainfall: { min: 300, max: 500 },
    },
    Sunflower: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 50, max: 75 },
      rainfall: { min: 500, max: 700 },
    },
    Groundnut: {
      temperature: { min: 25, max: 35 },
      humidity: { min: 50, max: 80 },
      rainfall: { min: 500, max: 1000 },
    },
    Soybean: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 50, max: 80 },
      rainfall: { min: 600, max: 1200 },
    },
  },
  Vegetables: {
    Tomato: {
      temperature: { min: 15, max: 30 },
      humidity: { min: 60, max: 80 },
      rainfall: { min: 500, max: 1200 },
    },
    Potato: {
      temperature: { min: 10, max: 25 },
      humidity: { min: 70, max: 85 },
      rainfall: { min: 300, max: 700 },
    },
    Onion: {
      temperature: { min: 15, max: 30 },
      humidity: { min: 60, max: 70 },
      rainfall: { min: 500, max: 800 },
    },
    Cabbage: {
      temperature: { min: 5, max: 25 },
      humidity: { min: 60, max: 80 },
      rainfall: { min: 600, max: 1000 },
    },
    Carrot: {
      temperature: { min: 10, max: 25 },
      humidity: { min: 60, max: 75 },
      rainfall: { min: 500, max: 900 },
    },
  },
  Fruits: {
    Mango: {
      temperature: { min: 20, max: 40 },
      humidity: { min: 50, max: 80 },
      rainfall: { min: 750, max: 2500 },
    },
    Banana: {
      temperature: { min: 20, max: 35 },
      humidity: { min: 70, max: 90 },
      rainfall: { min: 1000, max: 2500 },
    },
    Apple: {
      temperature: { min: 5, max: 25 },
      humidity: { min: 60, max: 80 },
      rainfall: { min: 800, max: 1500 },
    },
    Citrus: {
      temperature: { min: 15, max: 30 },
      humidity: { min: 60, max: 80 },
      rainfall: { min: 750, max: 1200 },
    },
    Grapes: {
      temperature: { min: 15, max: 35 },
      humidity: { min: 50, max: 75 },
      rainfall: { min: 500, max: 1000 },
    },
  },
  FiberCrops: {
    Cotton: {
      temperature: { min: 20, max: 40 },
      humidity: { min: 60, max: 80 },
      rainfall: { min: 600, max: 1200 },
    },
    Jute: {
      temperature: { min: 20, max: 35 },
      humidity: { min: 70, max: 90 },
      rainfall: { min: 1500, max: 2500 },
    },
  },
  SpicesAndPlantationCrops: {
    Tea: {
      temperature: { min: 15, max: 30 },
      humidity: { min: 75, max: 90 },
      rainfall: { min: 1500, max: 3000 },
    },
    Coffee: {
      temperature: { min: 18, max: 30 },
      humidity: { min: 70, max: 90 },
      rainfall: { min: 1200, max: 2500 },
    },
    Pepper: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 70, max: 90 },
      rainfall: { min: 1250, max: 2500 },
    },
    Cardamom: {
      temperature: { min: 15, max: 30 },
      humidity: { min: 70, max: 90 },
      rainfall: { min: 1500, max: 3500 },
    },
  },
};

const cropDetailsSchema = new mongoose.Schema(
  {
    cropCategory: {
      type: String,
      required: true,
      enum: Object.keys(cropThresholds),
    },
    crops: [
      {
        _id: false,
        cropType: {
          type: String,
          required: true,
        },

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
  { _id: false }
);

const insurancePolicySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Policy name is required"],
      trim: true,
    },
    policyNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0");
        return `CROP-${timestamp}-${random}`;
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    cropSeason: {
      type: String,
      enum: ["kharif", "rabi", "zaid"],
      required: true,
    },
    cropDetails: [cropDetailsSchema],
    seasonDates: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
        validate: [
          {
            validator: function (value) {
              return this.seasonDates.startDate < value;
            },
            message: "End date must be after start date",
          },
        ],
      },
    },
    premium: {
      type: Number,
      required: true,
      min: 0,
    },
    sumInsured: {
      type: Number,
      required: true,
      min: 0,
    },
    agentFee: {
      type: Number,
      required: true,
      min: 0,
    },
    risks: [
      {
        type: String,
        enum: ["drought", "flood", "natural_calamities"],
        required: true,
      },
    ],
    eligibility: {
      minLandArea: { type: Number, required: true },
      maxLandArea: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            return value >= this.eligibility.minLandArea;
          },
          message:
            "Max land area must be greater than or equal to min land area",
        },
      },
      requiredDocuments: [
        {
          type: String,
          required: true,
        },
      ],
    },
    claimCriteria: [
      {
        damageType: {
          type: String,
          enum: ["crop_loss", "yield_reduction", "quality_damage"],
          required: true,
        },
        minimumDamagePercentage: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        compensationPercentage: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
      },
    ],
    regions: [
      {
        state: {
          type: String,
          required: true,
          trim: true,
          set: capitalizeWords,
        },
        district: {
          type: String,
          required: true,
          trim: true,
          set: capitalizeWords,
        },
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware to automatically set thresholds based on crop selection
insurancePolicySchema.pre("validate", function (next) {
  this.cropDetails.forEach((categoryDetail) => {
    categoryDetail.crops.forEach((crop) => {
      const thresholdData =
        cropThresholds[categoryDetail.cropCategory]?.[crop.cropType];
      if (thresholdData) {
        crop.thresholds = {
          temperature: {
            minTemperature: thresholdData.temperature.min,
            maxTemperature: thresholdData.temperature.max,
          },
          rainfall: {
            minRainfall: thresholdData.rainfall.min,
            maxRainfall: thresholdData.rainfall.max,
          },
          humidity: {
            minHumidity: thresholdData.humidity.min,
            maxHumidity: thresholdData.humidity.max,
          },
        };
      }
    });
  });
  next();
});

insurancePolicySchema.pre("save", function (next) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(this.seasonDates.startDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(this.seasonDates.endDate);
  endDate.setHours(0, 0, 0, 0);

  if (today >= startDate && today <= endDate) {
    this.status = "active";
  } else if (today > endDate) {
    this.status = "inactive";
  } else {
    this.status = "draft";
  }

  next();
});
async function updatePolicyStatuses() {
  const today = new Date();

  await InsurancePolicy.updateMany(
    {
      "seasonDates.startDate": {
        $lte: today,
      },
      "seasonDates.endDate": {
        $gte: today,
      },
    },
    { status: "active" }
  );

  await InsurancePolicy.updateMany(
    {
      "seasonDates.endDate": {
        $lt: today,
      },
    },
    { status: "inactive" }
  );
}

const InsurancePolicy = mongoose.model(
  "InsurancePolicy",
  insurancePolicySchema
);

module.exports = InsurancePolicy;
