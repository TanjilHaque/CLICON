const express = require("express"); // Import Express framework
const cors = require("cors"); // Import CORS middleware
const cookieParser = require("cookie-parser"); // Import cookie parser middleware
const { globalErrorHandler } = require("./uitils/globalErrorHandler"); // Import custom error handler
const app = express(); // Create an Express app instance
const http = require("http");
const morgan = require("morgan");
const { initSocket } = require("./socket/server");
// Middlewares
// cors, cookie parser, express.json, express.static, express.urlencoded
const server = http.createServer(app);
const io = initSocket(server);
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
// routes
const apiVersion = process.env.BASE_URL;
app.use(`/api/v1`, require("./routes/index"));

// error handaling middleware
app.use(globalErrorHandler);

module.exports = { server, io };
