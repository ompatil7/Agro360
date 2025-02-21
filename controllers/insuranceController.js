const InsurancePolicy = require("../models/insuranceModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
exports.createPolicy = catchAsync(async (req, res, next) => {
  const policy = await InsurancePolicy.create({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: { policy },
  });
});
// Get all policies (accessible to everyone)
exports.getAllPolicies = catchAsync(async (req, res, next) => {
  const policies = await InsurancePolicy.find().populate(
    "createdBy",
    "name email"
  );

  res.status(200).json({
    status: "success",
    results: policies.length,
    data: { policies },
  });
});

// Get a single policy by ID (accessible to everyone)
exports.getPolicy = catchAsync(async (req, res, next) => {
  const policy = await InsurancePolicy.findById(req.params.id);

  if (!policy) {
    return next(new AppError("No policy found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { policy },
  });
});

// Create a policy (admin-only)

// Update a policy (restricted to the creator admin)
exports.updatePolicy = catchAsync(async (req, res, next) => {
  const policy = await InsurancePolicy.findById(req.params.id);

  if (!policy) {
    return next(new AppError("No policy found with that ID", 404));
  }

  if (policy.createdBy.toString() !== req.user.id) {
    return next(
      new AppError("You do not have permission to update this policy", 403)
    );
  }

  const updatedPolicy = await InsurancePolicy.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    }
  );

  res.status(200).json({
    status: "success",
    data: { policy: updatedPolicy },
  });
});

// Delete a policy (restricted to the creator admin)
exports.deletePolicy = catchAsync(async (req, res, next) => {
  const policy = await InsurancePolicy.findById(req.params.id);

  if (!policy) {
    return next(new AppError("No policy found with that ID", 404));
  }

  if (policy.createdBy.toString() !== req.user.id) {
    return next(
      new AppError("You do not have permission to delete this policy", 403)
    );
  }

  await InsurancePolicy.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
