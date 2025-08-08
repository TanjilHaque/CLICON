const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { golbalErrorHandler } = require("./uitils/globalErrorHandler");
const app = express();

// Middlewares
// cors, cookie parser, express.json, express.static, express.urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(cookieParser());

// Routes
// work will be on the route folder
app.use("/api/v1", require("./routes/index"));

// Error Handling Middlewares
app.use(golbalErrorHandler);

module.exports = { app };
