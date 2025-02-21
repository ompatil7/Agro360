const express = require("express");

const authController = require("./../controllers/authController");

const userController = require("./../controllers/userController");

const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.get("/user", authController.user);
router.get("/search", userController.searchUser);
router.patch(
  "/updateme",
  authController.protect, // Add this line to authenticate the user
  userController.resizeUserImage,
  userController.updateme
);
router.patch("/updateMyPassword", authController.updatePassword);
router.use(authController.protect);
router.use(authController.restrictTo("admin", "agent", "user"));

router.route("/").get(userController.getalluser);
module.exports = router;
