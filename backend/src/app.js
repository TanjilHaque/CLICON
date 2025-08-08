const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
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
app.use((error, req, res, next) => {
  console.log(error);
});

module.exports = { app };
