const express = require("express");
const insurancePolicyController = require("../controllers/insuranceController");
const authController = require("../controllers/authController");
const translateMiddleware = require("./../controllers/translationController");
const router = express.Router();
const conditionalTranslateMiddleware = (req, res, next) => {
  if (req.query.lang) {
    translateMiddleware(req, res, next);
  } else {
    next();
  }
};
router
  .route("/")
  .get(
    conditionalTranslateMiddleware,
    insurancePolicyController.getAllPolicies
  );
router.route("/:id").get(insurancePolicyController.getPolicy);

router.use(authController.protect, authController.restrictTo("admin", "agent"));

router.route("/").post(insurancePolicyController.createPolicy);

router
  .route("/:id")
  .patch(insurancePolicyController.updatePolicy)
  .delete(insurancePolicyController.deletePolicy);

module.exports = router;
