const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

const Insurancepolicy = require("../models/insuranceModel");

const InsuranceAssignment = require("../models/assignmentModel");
const AppError = require("../utils/appError");
exports.createInsuranceAssignment = catchAsync(async (req, res, next) => {
  const farmerId = req.user.id;
  const { insurancePolicyId } = req.params;
  const { state, district } = req.body;

  console.log("Insurance Policy ID:", insurancePolicyId);
  console.log("Farmer ID:", farmerId);

  if (!User || !Insurancepolicy) {
    return next(new AppError("Models are not properly imported", 500));
  }

  const farmer = await User.findById(farmerId);
  const insurancePolicy = await Insurancepolicy.findById(insurancePolicyId);

  if (!farmer || !insurancePolicy) {
    return next(new AppError("Invalid farmer or insurance policy", 400));
  }

  const existingAssignment = await InsuranceAssignment.findOne({
    farmer: farmerId,
    insurancePolicy: insurancePolicyId,
  });

  if (existingAssignment) {
    return next(
      new AppError("You have already applied for this insurance policy", 400)
    );
  }

  const assignment = await InsuranceAssignment.create({
    farmer: farmerId,
    insurancePolicy: insurancePolicyId,
    region: {
      state: state || farmer.address?.state,
      district: district || farmer.address?.district,
    },
    status: "pending",
  });

  res.status(201).json({
    status: "success",
    data: { assignment },
  });
});

exports.getMyAssignedInsurance = catchAsync(async (req, res, next) => {
  // Get logged in agent's ID from req.user
  const agentId = req.user._id;

  const assignments = await InsuranceAssignment.find({
    agent: agentId,
    status: "assigned",
  })
    .populate({
      path: "farmer",
      select: "name email phone address",
    })
    .populate({
      path: "insurancePolicy",
      select: "name description coverage premium",
    });

  res.status(200).json({
    status: "success",
    results: assignments.length,
    data: {
      assignments,
    },
  });
});

exports.findAvailableAgentsForAssignment = catchAsync(
  async (req, res, next) => {
    const { assignmentId } = req.params;

    const assignment = await InsuranceAssignment.findById(assignmentId);

    if (!assignment) {
      return next(new AppError("Insurance assignment not found", 404));
    }

    if (assignment.status === "assigned") {
      return next(
        new AppError("This assignment already has an agent assigned", 400)
      );
    }

    const availableAgents =
      await InsuranceAssignment.findAvailableAgentsInRegion(
        assignment.region.state,
        assignment.region.district
      );

    res.status(200).json({
      status: "success",
      results: availableAgents.length,
      data: { agents: availableAgents },
    });
  }
);

exports.assignAgentToInsurance = catchAsync(async (req, res, next) => {
  const { assignmentId } = req.params;
  const { agentId, visitDate } = req.body;

  if (!visitDate) {
    return next(new AppError("Visit date is required", 400));
  }

  const assignment = await InsuranceAssignment.findById(assignmentId);

  if (!assignment) {
    return next(new AppError("Insurance assignment not found", 404));
  }

  // If this is just a visit date update
  if (assignment.status === "assigned" && !agentId) {
    const visitDateObj = new Date(visitDate);
    const today = new Date();

    if (visitDateObj < today) {
      return next(new AppError("Visit date must be in the future", 400));
    }

    assignment.visitDate = visitDateObj;
    assignment.notes += `\nVisit date updated to ${visitDateObj.toISOString()}`;

    await assignment.save();

    return res.status(200).json({
      status: "success",
      data: { assignment },
    });
  }

  // If this is a new agent assignment
  if (assignment.status === "assigned") {
    return next(
      new AppError("This assignment already has an agent assigned", 400)
    );
  }

  const agent = await User.findById(agentId);

  if (!agent || agent.role !== "agent") {
    return next(new AppError("Invalid agent", 400));
  }

  if (
    agent.address.state !== assignment.region.state ||
    agent.address.district !== assignment.region.district
  ) {
    return next(new AppError("Agent must be from the same region", 400));
  }

  const visitDateObj = new Date(visitDate);
  const today = new Date();

  if (visitDateObj < today) {
    return next(new AppError("Visit date must be in the future", 400));
  }

  // Update assignment
  assignment.agent = agentId;
  assignment.status = "assigned";
  assignment.assignedDate = new Date();
  assignment.visitDate = visitDateObj;
  assignment.notes = `Agent assigned on ${new Date().toISOString()} with scheduled visit on ${visitDateObj.toISOString()}`;

  await assignment.save();

  res.status(200).json({
    status: "success",
    data: { assignment },
  });
});

exports.getInsuranceAssignments = catchAsync(async (req, res, next) => {
  const { status, state, district, visitDate } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (state) filter["region.state"] = state;
  if (district) filter["region.district"] = district;
  if (visitDate) filter.visitDate = new Date(visitDate);

  const assignments = await InsuranceAssignment.find(filter)
    .populate("farmer", "name email phone")
    .populate("insurancePolicy", "name cropType")
    .populate("agent", "name email phone")
    .sort({ visitDate: 1 });

  res.status(200).json({
    status: "success",
    results: assignments.length,
    data: { assignments },
  });
});
exports.updateInsuranceAssignment = catchAsync(async (req, res, next) => {
  const { assignmentId } = req.params;
  const { status, notes, visitDate } = req.body;

  const assignment = await InsuranceAssignment.findById(assignmentId);

  if (!assignment) {
    return next(new AppError("Insurance assignment not found", 404));
  }

  if (status) assignment.status = status;
  if (notes) assignment.notes = notes;
  if (visitDate) assignment.visitDate = new Date(visitDate);

  await assignment.save();

  res.status(200).json({
    status: "success",
    data: { assignment },
  });
});
exports.deleteInsuranceAssignment = catchAsync(async (req, res, next) => {
  const { assignmentId } = req.params;

  const assignment = await InsuranceAssignment.findByIdAndDelete(assignmentId);

  if (!assignment) {
    return next(new AppError("Insurance assignment not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMyAssignments = catchAsync(async (req, res, next) => {
  const farmerId = req.user._id;

  const assignments = await InsuranceAssignment.find({ farmer: farmerId })
    .populate("insurancePolicy", "name description coverage premium")
    .populate("agent", "name email phone");

  res.status(200).json({
    status: "success",
    results: assignments.length,
    data: { assignments },
  });
});
