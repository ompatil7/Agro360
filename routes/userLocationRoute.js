const express = require("express");
const farmVisitController = require("../controllers/userLocationController");
const authController = require("../controllers/authController");
const translateMiddleware = require("./../controllers/translationController");
const router = express.Router();
router.use(translateMiddleware);
router.use(authController.protect);

// User Search Route
router.get(
  "/search-users",
  authController.restrictTo("admin", "agent"),
  farmVisitController.searchUsers
);

// Farm Visit Routes
router.post("/", farmVisitController.createFarmVisit);
router.get("/", farmVisitController.getAllFarmVisits);
router.get("/:id", farmVisitController.getFarmVisitById);
router.patch("/:id", farmVisitController.updateFarmVisit);
router.delete("/:id", farmVisitController.deleteFarmVisit);

module.exports = router;
