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

router.get("/myclaims", authController.protect, claimController.getMyClaims);
router.get(
  "/statusclaim",
  authController.protect,
  claimController.getFarmerClaimStatus
);
router.get(
  "/getallclaims",
  authController.protect,
  authController.restrictTo("admin"),
  claimController.getAllClaims
);
router.get(
  "/adminclaimstatus",
  authController.protect,
  authController.restrictTo("admin"),
  claimController.getAdminClaimStatus
);

module.exports = router;
