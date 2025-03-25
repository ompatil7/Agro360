const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const FarmVisitTracking = require("../models/farmvisitTrackingModel");
const InsurancePremiumPayment = require("../models/paymentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("./../utils/email");
const Web3 = require("web3").default;
const fs = require("fs");
const path = require("path");

// Setup Web3 and Contract
const web3 = new Web3("http://127.0.0.1:7545");
const contractABI = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../build/CropInsuranceContract_abi.json"),
    "utf8"
  )
);
const contractAddress = fs
  .readFileSync(
    path.resolve(__dirname, "../build/CropInsuranceContract_address.txt"),
    "utf8"
  )
  .trim();

const cropInsuranceContract = new web3.eth.Contract(contractABI, contractAddress);

exports.getInsurancePremiumCheckoutSession = catchAsync(
  async (req, res, next) => {
    const { enrollmentId } = req.params;

    const enrollment = await FarmVisitTracking.findById(enrollmentId);
    console.log("enrollment ", enrollment);

    if (!enrollment)
    {
      return next(new AppError("No enrollment found with that ID", 404));
    }

    if (req.user.id !== enrollment.farmer.toString())
    {
      return next(
        new AppError("You can only pay for your own insurance policies", 403)
      );
    }

    try
    {
      const accounts = await web3.eth.getAccounts();
      const fromAddress = accounts[0];

      // Create a unique hash for the enrollment
      const enrollmentHash = web3.utils.sha3(
        enrollment._id.toString() + Date.now().toString()
      );

      // Convert coordinates to integers (multiply by 1e6 to preserve decimals)
      const coordinates = enrollment.farmDetails.geolocation.coordinates;
      const latitude = Math.floor(coordinates[0] * 1000000);
      const longitude = Math.floor(coordinates[1] * 1000000);

      // Prepare data for blockchain
      const blockchainData = {
        status: enrollment.status || "pending",
        payment: enrollment.payment || "pending",
        enrollmentDate: Math.floor(enrollment.enrollmentDate.getTime() / 1000),
        policy: {
          startDate: Math.floor(
            enrollment.policyDetails.seasonDates.startDate.getTime() / 1000
          ),
          endDate: Math.floor(
            enrollment.policyDetails.seasonDates.endDate.getTime() / 1000
          ),
          policyName: enrollment.policyDetails.policyName,
          policyNumber: enrollment.policyDetails.policyNumber,
          sumInsured: Number(enrollment.policyDetails.sumInsured),
          premium: Number(enrollment.policyDetails.premium)
        },
        farm: {
          areaSize: Number(enrollment.farmDetails.areaSize),
          irrigationType: enrollment.farmDetails.irrigationType,
          radius: Number(enrollment.farmDetails.radius),
          latitude: latitude,
          longitude: longitude
        },
        farmer: {
          name: enrollment.farmerDetails.name,
          email: enrollment.farmerDetails.email,
          phone: enrollment.farmerDetails.phone,
          state: enrollment.farmerDetails.address.state,
          district: enrollment.farmerDetails.address.district
        }
      };

      console.log("Preparing to store data in blockchain:", blockchainData);

      // Flatten the structs into arrays to match the Solidity struct order
      const policyArray = [
        blockchainData.policy.startDate,
        blockchainData.policy.endDate,
        blockchainData.policy.policyName,
        blockchainData.policy.policyNumber,
        blockchainData.policy.sumInsured,
        blockchainData.policy.premium
      ];

      const farmArray = [
        blockchainData.farm.areaSize,
        blockchainData.farm.irrigationType,
        blockchainData.farm.radius,
        blockchainData.farm.latitude,
        blockchainData.farm.longitude
      ];

      const farmerArray = [
        blockchainData.farmer.name,
        blockchainData.farmer.email,
        blockchainData.farmer.phone,
        blockchainData.farmer.state,
        blockchainData.farmer.district
      ];

      // Call the contract using the flattened arrays
      const result = await cropInsuranceContract.methods
        .createEnrollment(
          enrollmentHash,
          blockchainData.status,
          blockchainData.payment,
          blockchainData.enrollmentDate,
          policyArray,
          farmArray,
          farmerArray
        )
        .send({
          from: fromAddress,
          gas: 6000000
        });

      console.log("Enrollment stored in blockchain:", result.transactionHash);

      // Store crop categories
      const categories = enrollment.cropDetails.map(
        (detail) => detail.cropCategory
      );

      await cropInsuranceContract.methods
        .addCropCategories(enrollmentHash, categories)
        .send({
          from: fromAddress,
          gas: 3000000
        });

      console.log("Crop categories stored in blockchain successfully");
    } catch (error)
    {
      console.error("Detailed blockchain error:", error);
      return next(
        new AppError(
          "Failed to store enrollment in blockchain: " + error.message,
          500
        )
      );
    }

    // Proceed with creating a Stripe payment session
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
              description: `Policy Number: ${enrollment.policyDetails.policyNumber}`
            },
            unit_amount: enrollment.policyDetails.premium * 100
          },
          quantity: 1
        }
      ],
      mode: "payment",
      billing_address_collection: "required",
      metadata: {
        policyNumber: enrollment.policyDetails.policyNumber,
        farmerId: enrollment.farmer.toString(),
        farmerName: enrollment.farmerDetails.name
      }
    });

    res.status(200).json({
      status: "success",
      session
    });
  }
);

// exports.createPremiumPaymentCheckout = catchAsync(async (req, res, next) => {
//   const { enrollment, payment } = req.query;

//   if (!enrollment || payment !== "success") {
//     return next(new AppError("Invalid payment confirmation", 400));
//   }

//   const enrollmentData = await FarmVisitTracking.findById(enrollment);
//   if (!enrollmentData) {
//     return next(new AppError("Enrollment not found", 404));
//   }
//   enrollmentData.payment = "done";
//   await enrollmentData.save();
//   const paymentRecord = await InsurancePremiumPayment.create({
//     farmer: enrollmentData.farmer,
//     farmerName: enrollmentData.farmerDetails.name,
//     enrollement: enrollment,
//     insurancePolicy: enrollmentData.insurancePolicy,
//     policyDetails: enrollmentData.policyDetails,
//   });

//   const url = `${req.protocol}://localhost:5173/profile`;

//   // const email = new Email(req.user, url);
//   // await email.sendBookingReceipt(paymentRecord);
//   res.status(201).json({
//     status: "success",
//     message: "Insurance premium payment recorded successfully",
//     data: paymentRecord,
//   });
// });
exports.createPremiumPaymentCheckout = catchAsync(async (req, res, next) => {
  const { enrollment, payment } = req.query;

  if (!enrollment || payment !== "success")
  {
    return next(new AppError("Invalid payment confirmation", 400));
  }

  const enrollmentData = await FarmVisitTracking.findById(enrollment);
  if (!enrollmentData)
  {
    return next(new AppError("Enrollment not found", 404));
  }

  // Check if payment already exists
  const existingPayment = await InsurancePremiumPayment.findOne({
    enrollement: enrollment,
  });

  if (existingPayment)
  {
    return next(new AppError("Payment already processed", 400));
  }

  enrollmentData.payment = "done";
  await enrollmentData.save();

  const paymentRecord = await InsurancePremiumPayment.create({
    farmer: enrollmentData.farmer,
    farmerName: enrollmentData.farmerDetails.name,
    enrollement: enrollment,
    insurancePolicy: enrollmentData.insurancePolicy,
    policyDetails: enrollmentData.policyDetails,
    paymentDetails: {
      transactionId: `TXN-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}`,
      amount: enrollmentData.policyDetails.premium,
      status: "success",
      paymentDate: new Date(),
    },
  });

  const url = `${req.protocol}://localhost:5173/profile`;
  const email = new Email(req.user, url);
  await email.sendBookingReceipt(paymentRecord);
  res.status(201).json({
    status: "success",
    message: "Insurance premium payment recorded successfully",
    data: paymentRecord,
  });
});