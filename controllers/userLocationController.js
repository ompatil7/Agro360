const FarmVisit = require("../models/userLocationModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appErrors");
const User = require("./../models/userModel");
exports.createFarmVisit = catchAsync(async (req, res, next) => {
  const farmVisitData = {
    ...req.body,
    agent: req.user._id, // Use logged-in user's ID
  };

  const farmVisit = await FarmVisit.create(farmVisitData);

  res.status(201).json({
    status: "success",
    data: farmVisit,
  });
});

exports.getAllFarmVisits = catchAsync(async (req, res, next) => {
  const filter = req.user.role === "agent" ? { agent: req.user._id } : {};

  const farmVisits = await FarmVisit.find(filter)
    .populate("farmer", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: farmVisits.length,
    data: farmVisits,
  });
});

exports.getFarmVisitById = catchAsync(async (req, res, next) => {
  const farmVisit = await FarmVisit.findById(req.params.id)
    .populate("farmer", "name email")
    .populate("agent", "name email");

  if (!farmVisit) {
    return next(new AppError("Farm visit not found", 404));
  }

  if (
    req.user.role !== "admin" &&
    req.user.role !== "agent" &&
    farmVisit.agent.toString() !== req.user._id.toString()
  ) {
    return next(
      new AppError(
        `You are not authorized. Only admins or the agent assigned to this farm visit can access this resource.`,
        403
      )
    );
  }

  res.status(200).json({
    status: "success",
    data: farmVisit,
  });
});

exports.updateFarmVisit = catchAsync(async (req, res, next) => {
  const farmVisit = await FarmVisit.findById(req.params.id);

  if (!farmVisit) {
    return next(new AppError("Farm visit not found", 404));
  }

  if (farmVisit.agent.toString() !== req.user._id.toString()) {
    return next(new AppError("You can only update your own farm visits", 403));
  }

  const updatedFarmVisit = await FarmVisit.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedFarmVisit,
  });
});

exports.deleteFarmVisit = catchAsync(async (req, res, next) => {
  const farmVisit = await FarmVisit.findById(req.params.id);

  if (!farmVisit) {
    return next(new AppError("Farm visit not found", 404));
  }

  if (farmVisit.agent.toString() !== req.user._id.toString()) {
    return next(new AppError("You can only delete your own farm visits", 403));
  }

  await FarmVisit.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.searchUsers = catchAsync(async (req, res, next) => {
  const { search } = req.query;

  if (!search) {
    return next(new AppError("Please provide a search term", 400));
  }

  const users = await User.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ],
  }).select("_id name email phone role");

  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});
