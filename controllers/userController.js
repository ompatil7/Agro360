const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appErrors");
const sharp = require("sharp");

const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("not an image!! please upload an image", 400));
  }
};
const storage = multer.memoryStorage(); // Store files in memory as buffers

const upload = multer({
  storage,
  fileFilter: multerFilter,
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.resizeUserImage = catchAsync(async (req, res, next) => {
  upload.single("photo")(req, res, async (err) => {
    if (err) {
      return next(new AppError("Failed to upload image.", 400));
    }

    if (!req.file) return next();

    try {
      // Resize the image
      const resizedImageBuffer = await sharp(req.file.buffer)
        .resize({ width: 474, height: 497 })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();

      // Fix the Cloudinary upload process
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "cropinsurance/users",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        // Write buffer to the stream
        uploadStream.end(resizedImageBuffer);
      });

      req.body.photo = result.secure_url;
      next();
    } catch (err) {
      console.error("Image processing error:", err);
      return next(new AppError("Image processing failed", 500));
    }
  });
});
exports.getdetails = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    res.status(200).json({
      status: "fail",
      user: "no user",
    });
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id).populate("products");

  res.status(200).json({
    status: "success",
    user: freshUser,
  });
});

exports.getalluser = catchAsync(async (req, res, next) => {
  const doc = await User.find();

  if (!doc) {
    return next(new AppError("sorry there are no user for ur website", 404));
  }

  res.status(200).json({
    status: "success",
    users: {
      data: doc,
    },
  });
});

const filterObj = (obj, ...AllowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (AllowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.updateme = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(JSON.stringify(req.body));

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "do not insert the password here this is not the correct route please go on updatePassword route !! Thankuuuuuu",
        400
      )
    );
  }

  const filterObject = filterObj(req.body, "name", "email");
  if (req.file) filterObject.photo = req.body.photo;

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterObject, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updateUser,
    },
  });
});
exports.searchUser = catchAsync(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new AppError("Please provide a search query.", 400));
  }

  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
  });

  if (users.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "No users found matching your search.",
      data: [],
    });
  }

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
