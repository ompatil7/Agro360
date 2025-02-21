const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("./../utils/email");
// const crypto = require("crypto");
const validator = require("validator");
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove sensitive data from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phone: req.body.phone,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        district: req.body.address.district,
        state: req.body.address.state,
        pincode: req.body.address.pincode,
        landmark: req.body.address.landmark,
      },
    });

    newUser.password = undefined;
    const url = `${req.protocol}://localhost:5173/profile`;

    await new Email(newUser, url).sendWelcome();
    createSendToken(newUser, 201, res);
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError(error, 400));
    }
    return next(error);
  }
});
exports.login = catchAsync(async (req, res, next) => {
  const { emailOrPhone, password } = req.body;

  // 1) Check if email/phone and password exist
  if (!emailOrPhone || !password) {
    return next(new AppError("Please provide email/phone and password!", 400));
  }

  // 2) Check if the provided input is an email or phone number and find the user
  let user;
  if (emailOrPhone.includes("@")) {
    // If input is an email
    user = await User.findOne({ email: emailOrPhone }).select("+password");
  } else {
    // If input is a phone number
    user = await User.findOne({ phone: emailOrPhone }).select("+password");
  }

  // 3) If user does not exist or password is incorrect
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email/phone or password", 401));
  }

  // 4) If everything ok, send token to client
  createSendToken(user, 200, res);
  console.log(user);
});

exports.role = catchAsync(async (req, res, next) => {
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
    return next(
      new AppError("you are not logged in !! please login to get access", 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);

  res.status(200).json({
    status: "success",
    role: freshUser.role,
  });
});
exports.user = catchAsync(async (req, res, next) => {
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

  const freshUser = await User.findById(decoded.id);

  res.status(200).json({
    status: "success",
    user: freshUser,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Check if token exists in headers or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("The user associated with this token no longer exists.", 401)
    );
  }

  // Check if user changed password after token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password. Please log in again.", 401)
    );
  }

  // Grant access to protected route
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //req.user we specified i.e.  we saved the logined user in tht above as req.user=fresh user
    //////this is very important ***************************
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Sorry you do not have permission to perform this action !!!",
          403
        )
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    // 3) Send it to user's email
    // const resetURL = `${req.protocol}://localhost:5173/resetPassword/${resetToken}`;
    // await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    console.log(err); // Add this line to log the error
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1 getting user based on the token

  //encryption of reset token

  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) if there is no user or there is an invalid token then

  if (!user) {
    return next(new AppError("sorry the token is invalid or expired ", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //3) we will go in user model to change the password chagedat property and for that we will use a middleware

  //4)now login in the user

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.updatePassword = async (req, res, next) => {
  //1) get the user from the collection
  const user = await User.findById(req.user.id).select("+password");

  //2)check if the posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      new AppError(
        "sorry you have entered invalid password please tryagain ",
        203
      )
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
