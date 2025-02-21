const mongoose = require("mongoose");
const dotenv = require("dotenv");
const diseases = require("./diseasedescription.json"); // Load your JSON file

// Configure environment variables
dotenv.config({ path: "./config.env" });

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

// Create model
const Disease = mongoose.model("Disease", diseaseSchema);

// Database connection
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

const importData = async () => {
  try {
    await mongoose.connect(DB);
    console.log("DB connection successful!");

    // Delete existing data
    await Disease.deleteMany();
    console.log("Data successfully deleted!");

    // Insert new data
    await Disease.insertMany(diseases);
    console.log("Data successfully imported!");

    process.exit();
  } catch (err) {
    console.error("ERROR 💥:", err);
    process.exit(1);
  }
};

importData();
