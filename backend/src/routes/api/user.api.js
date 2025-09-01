const express = require("express");
const _ = express.Router();
const authController = require("../../controller/user.controller");

_.route("/registration").post(authController.registration);
_.route("/login").post(authController.login);
_.route("/email-verifcation").post(authController.emailVerifcation);

module.exports = _;
