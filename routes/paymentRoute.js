const express = require("express");
const insurancePaymentController = require("../controllers/paymentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get(
  "/checkout-session/:enrollmentId",
  insurancePaymentController.getInsurancePremiumCheckoutSession
);

router.get("/booking", insurancePaymentController.createPremiumPaymentCheckout);

module.exports = router;
