const express = require("express");
const _ = express.Router();
const authController = require("../../controller/user.controller");
const { authGuard } = require("../../middleware/authGuard.middleware");

_.route("/registration").post(authController.registration);
_.route("/login").post(authController.login);
_.route("/email-verifcation").post(authController.emailVerifcation);
_.route("/forgot-password").post(authController.forgotPassword);
_.route("/reset-password").post(authController.resetPassword);
_.route("/logout").post(authGuard, authController.logout);
_.route("/getMe").get(authGuard, authController.getMe);

module.exports = _;
