const express = require("express");
const policyEnrollmentController = require("../controllers/farmvisitTrackingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/:insuranceAssignmentId",
  authController.protect,
  policyEnrollmentController.createPolicyEnrollment
);

router.get(
  "/farmer/:insuranceAssignmentId",
  policyEnrollmentController.getFarmVisitsByAssignmentId
);

router.get(
  "/single/:id",
  authController.protect,
  policyEnrollmentController.getsinglefinal
);

router.get(
  "/myinsurances",
  authController.protect,
  policyEnrollmentController.getmyfinal
);
router.get(
  "/agentmy",
  authController.protect,
  policyEnrollmentController.getAgentEnrollments
);

module.exports = router;
