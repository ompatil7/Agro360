const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const FarmVisitTracking = require("../models/farmvisitTrackingModel"); // Adjust path as needed
const InsurancePremiumPayment = require("../models/paymentModel");
const catchAsync = require("../utils/catchAsync"); // Adjust path as needed
const AppError = require("../utils/appError"); // Adjust path as needed

exports.getInsurancePremiumCheckoutSession = catchAsync(
  async (req, res, next) => {
    const { enrollmentId } = req.params;

    const enrollment = await FarmVisitTracking.findById(enrollmentId);

    if (!enrollment) {
      return next(new AppError("No enrollment found with that ID", 404));
    }

    if (req.user.id !== enrollment.farmer.toString()) {
      return next(
        new AppError("You can only pay for your own insurance policies", 403)
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${req.protocol}://localhost:5173/profile/my-insurances?enrollment=${enrollmentId}&payment=success`,
      cancel_url: `${req.protocol}://localhost:5173/profile/my-insurances/${enrollmentId}`,
      customer_email: enrollment.farmerDetails.email,
      client_reference_id: enrollmentId,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Insurance Premium: ${enrollment.policyDetails.policyName}`,
              description: `Policy Number: ${enrollment.policyDetails.policyNumber}`,
            },
            unit_amount: enrollment.policyDetails.premium * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      billing_address_collection: "required",
      metadata: {
        policyNumber: enrollment.policyDetails.policyNumber,
        farmerId: enrollment.farmer.toString(),
        farmerName: enrollment.farmerDetails.name,
      },
    });

    // 5) Send session as response
    res.status(200).json({
      status: "success",
      session,
    });
  }
);

exports.createPremiumPaymentCheckout = catchAsync(async (req, res, next) => {
  const { enrollment, payment } = req.query;

  if (!enrollment || payment !== "success") {
    return next(new AppError("Invalid payment confirmation", 400));
  }

  const enrollmentData = await FarmVisitTracking.findById(enrollment);
  if (!enrollmentData) {
    return next(new AppError("Enrollment not found", 404));
  }
  enrollmentData.payment = "done";
  await enrollmentData.save();
  const paymentRecord = await InsurancePremiumPayment.create({
    farmer: enrollmentData.farmer,
    farmerName: enrollmentData.farmerDetails.name,
    enrollement: enrollment,
    insurancePolicy: enrollmentData.insurancePolicy,
    policyDetails: enrollmentData.policyDetails,
  });
  res.status(201).json({
    status: "success",
    message: "Insurance premium payment recorded successfully",
    data: paymentRecord,
  });
});
