const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController");
const authController = require("../controllers/authController");

const { upload } = require("../controllers/claimController");

router.post(
  "/:policyEnrollmentId",
  authController.protect,
  upload.array("photos", 5),
  claimController.createClaim
);

module.exports = router;
