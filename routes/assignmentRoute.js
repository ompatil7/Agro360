const express = require("express");
const insuranceAssignmentController = require("../controllers/insuranceAssignmentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.post(
  "/create/:insurancePolicyId",
  authController.restrictTo("user", "admin", "agent"),
  insuranceAssignmentController.createInsuranceAssignment
);

router.get(
  "/available-agents/:assignmentId",
  authController.restrictTo("admin", "agent"),
  insuranceAssignmentController.findAvailableAgentsForAssignment
);

router.patch(
  "/assign-agent/:assignmentId",
  authController.restrictTo("admin", "agent"),
  insuranceAssignmentController.assignAgentToInsurance
);

router.get(
  "/my-assigned",
  authController.restrictTo("agent"),
  insuranceAssignmentController.getMyAssignedInsurance
);

router.get(
  "/",
  authController.restrictTo("admin", "agent"),
  insuranceAssignmentController.getInsuranceAssignments
);

router.patch(
  "/update/:assignmentId",
  authController.restrictTo("admin", "agent"),
  insuranceAssignmentController.updateInsuranceAssignment
);
router.delete(
  "/delete/:assignmentId",
  authController.restrictTo("admin"),
  insuranceAssignmentController.deleteInsuranceAssignment
);

router.get(
  "/my-assignments",
  authController.restrictTo("user"),
  insuranceAssignmentController.getMyAssignments
);
module.exports = router;
