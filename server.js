const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron");
const { updatePolicyStatuses } = require("./models/insuranceModel");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

const db = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db, {}).then((con) => {
  console.log(`Name of the database is ${con.connection.name}`);
  console.log("Successfully connected to the database");
});

cron.schedule("0 0 * * *", async () => {
  console.log("Running cron job to update policy statuses...");
  try {
    await updatePolicyStatuses();
    console.log("Policy statuses updated successfully.");
  } catch (err) {
    console.error("Error updating policy statuses:", err.message);
  }
});
const portnumber = 3000;
const server = app.listen(portnumber, () => {
  console.log("App is running on port 3000");
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION");
  server.close(() => {
    process.exit(1);
  });
});
