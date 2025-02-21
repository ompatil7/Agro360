const mongoose = require("mongoose");

const farmVisitSchema = new mongoose.Schema(
  {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Agent is required"],
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Farmer is required"],
    },
    farmDetails: {
      cropDetails: {
        type: Array,
        required: [true, "Crop details are required"],
        items: {
          type: Object,
          properties: {
            cropCategory: {
              type: String,
              required: [true, "Crop category is required"],
            },
            crops: {
              type: Array,
              required: [true, "Crops are required"],
              items: {
                type: Object,
                properties: {
                  cropType: {
                    type: String,
                    required: [true, "Crop type is required"],
                  },
                },
              },
            },
          },
        },
      },
      areaSize: {
        type: Number,
        required: [true, "Area size is required"],
      },
      irrigationType: {
        type: String,
        enum: ["Drip", "Flood", "Sprinkler", "Rain-fed"],
      },
    },
    radius: {
      type: Number,
      required: [true, "Radius is required"],
      min: [1, "Radius must be at least 1 meter"],
      description:
        "Radius of the farm visit coverage area, specified in meters.",
    },
    geolocation: {
      type: { type: String, default: "Point", enum: ["Point"] },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, "Coordinates are required"],
      },
    },
    notes: {
      type: String,
      trim: true,
    },
    visitIdentifier: {
      type: String,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
farmVisitSchema.pre("save", async function (next) {
  if (!this.visitIdentifier) {
    const farmerDoc = await mongoose.model("User").findById(this.farmer);
    if (!farmerDoc) {
      return next(new Error("Farmer not found"));
    }

    const farmerName = farmerDoc.name;
    const lat = this.geolocation.coordinates[1];
    const lon = this.geolocation.coordinates[0];

    this.visitIdentifier = `${farmerName}-${lat}-${lon}`;
  }
  next();
});
const FarmVisit = mongoose.model("FarmVisit", farmVisitSchema);

module.exports = FarmVisit;
