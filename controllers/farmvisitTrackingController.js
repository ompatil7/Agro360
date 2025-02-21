const PolicyEnrollment = require("../models/farmvisitTrackingModel");
const InsuranceAssignment = require("../models/assignmentModel");
const FarmVisit = require("../models/userLocationModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getFarmVisitsByAssignmentId = catchAsync(async (req, res, next) => {
  const { insuranceAssignmentId } = req.params;

  const insuranceAssignment = await InsuranceAssignment.findById(
    insuranceAssignmentId
  ).populate({
    path: "farmer",
    select: "_id",
  });

  if (!insuranceAssignment) {
    return next(new AppError("Insurance assignment not found", 404));
  }

  const farmerId = insuranceAssignment.farmer._id;

  const farmVisits = await FarmVisit.find({ farmer: farmerId }).populate({
    path: "agent",
    select: "name email phone",
  });

  if (!farmVisits.length) {
    return next(new AppError("No farm visits found for this farmer", 404));
  }

  res.status(200).json({
    status: "success",
    results: farmVisits.length,
    data: { farmVisits },
  });
});

exports.createPolicyEnrollment = catchAsync(async (req, res, next) => {
  const { insuranceAssignmentId } = req.params;
  const { farmVisitId } = req.body;

  // 1. Get and validate insurance assignment
  const insuranceAssignment = await InsuranceAssignment.findById(
    insuranceAssignmentId
  )
    .populate({
      path: "insurancePolicy",
      select: "name policyNumber sumInsured premium seasonDates cropDetails",
    })
    .populate({
      path: "farmer",
      select: "name email phone address",
    })
    .populate({
      path: "agent",
      select: "_id",
    });

  if (!insuranceAssignment) {
    return next(new AppError("Insurance assignment not found", 404));
  }

  // 2. Get and validate farm visit
  const farmVisit = await FarmVisit.findById(farmVisitId);
  if (!farmVisit) {
    return next(new AppError("Farm visit not found", 404));
  }

  // 3. Validate that the farm visit matches the farmer
  if (
    farmVisit.farmer.toString() !== insuranceAssignment.farmer._id.toString()
  ) {
    return next(
      new AppError("Farm visit does not match the assigned farmer", 400)
    );
  }

  // 4. Create policy enrollment object
  const enrollmentData = {
    insuranceAssignment: insuranceAssignmentId,
    farmVisit: farmVisitId,
    farmer: insuranceAssignment.farmer._id,
    agent: insuranceAssignment.agent._id,
    insurancePolicy: insuranceAssignment.insurancePolicy._id,
    policyDetails: {
      policyName: insuranceAssignment.insurancePolicy.name,
      policyNumber: insuranceAssignment.insurancePolicy.policyNumber,
      sumInsured: insuranceAssignment.insurancePolicy.sumInsured,
      premium: insuranceAssignment.insurancePolicy.premium,
      seasonDates: insuranceAssignment.insurancePolicy.seasonDates,
    },
    cropDetails: insuranceAssignment.insurancePolicy.cropDetails,
    farmDetails: {
      areaSize: farmVisit.farmDetails.areaSize,
      irrigationType: farmVisit.farmDetails.irrigationType,
      geolocation: farmVisit.geolocation,
      radius: farmVisit.radius,
    },
    farmerDetails: {
      name: insuranceAssignment.farmer.name,
      email: insuranceAssignment.farmer.email,
      phone: insuranceAssignment.farmer.phone,
      address: {
        state: insuranceAssignment.farmer.address.state,
        district: insuranceAssignment.farmer.address.district,
      },
    },
  };

  // 5. Create policy enrollment
  const policyEnrollment = await PolicyEnrollment.create(enrollmentData);

  // 6. Update insurance assignment status
  await InsuranceAssignment.findByIdAndUpdate(insuranceAssignmentId, {
    status: "completed",
  });

  res.status(201).json({
    status: "success",
    data: {
      policyEnrollment,
    },
  });
});

exports.getsinglefinal = catchAsync(async (req, res, next) => {
  const final = await PolicyEnrollment.findById(req.params.id)
    .populate("insuranceAssignment")
    .populate("farmVisit")
    .populate("farmer")
    .populate("agent")
    .populate("insurancePolicy");
  if (!final) {
    return next(new AppError("nothing present soory for that", 404));
  }
  res.status(200).json({
    status: "success",
    data: { final },
  });
});

exports.getall = catchAsync(async (req, res, next) => {
  const all = await PolicyEnrollment.find();
  if (!all) {
    return next(new AppError("nothing present here", 404));
  }
  res.status(200).json({
    status: "success",
    data: { all },
  });
});

exports.getagent = catchAsync(async (req, res, next) => {
  const farmerId = req.user.id;

  const enrollments = await PolicyEnrollment.find({ agent: farmerId })
    .populate({
      path: "insuranceAssignment",
      select: "status applicationDate assignedDate",
    })
    .populate({
      path: "farmVisit",
      select: "farmDetails geolocation visitIdentifier createdAt",
    })
    .populate({
      path: "agent",
      select: "name email phone",
    })
    .populate({
      path: "insurancePolicy",
      select: "name policyNumber sumInsured premium",
    });

  if (!enrollments.length) {
    return next(
      new AppError("No policy enrollments found for this farmer", 404)
    );
  }

  res.status(200).json({
    status: "success",
    results: enrollments.length,
    data: { enrollments },
  });
});
exports.getmyfinal = catchAsync(async (req, res, next) => {
  const farmerId = req.user.id;

  const enrollments = await PolicyEnrollment.find({ farmer: farmerId })
    .populate({
      path: "insuranceAssignment",
      select: "status applicationDate assignedDate",
    })
    .populate({
      path: "farmVisit",
      select: "farmDetails geolocation visitIdentifier createdAt",
    })
    .populate({
      path: "agent",
      select: "name email phone",
    })
    .populate({
      path: "insurancePolicy",
      select: "name policyNumber sumInsured premium",
    });

  if (!enrollments.length) {
    return next(
      new AppError("No policy enrollments found for this farmer", 404)
    );
  }

  res.status(200).json({
    status: "success",
    results: enrollments.length,
    data: { enrollments },
  });
});

exports.getAgentEnrollments = catchAsync(async (req, res, next) => {
  const agentId = req.user.id;

  const enrollments = await PolicyEnrollment.find({ agent: agentId })
    .populate({
      path: "insuranceAssignment",
      select: "status applicationDate assignedDate",
    })
    .populate({
      path: "farmVisit",
      select: "farmDetails geolocation visitIdentifier createdAt",
    })
    .populate({
      path: "farmer",
      select: "name email phone address",
    })
    .populate({
      path: "insurancePolicy",
      select: "name policyNumber sumInsured premium",
    });

  if (!enrollments.length) {
    return next(
      new AppError("No policy enrollments found for this agent", 404)
    );
  }

  res.status(200).json({
    status: "success",
    results: enrollments.length,
    data: { enrollments },
  });
});
