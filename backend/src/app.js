const express = require("express"); // Import Express framework
const cors = require("cors"); // Import CORS middleware
const cookieParser = require("cookie-parser"); // Import cookie parser middleware
const { golbalErrorHandler } = require("./uitils/globalErrorHandler"); // Import custom error handler
const app = express(); // Create an Express app instance

// Middlewares
// cors, cookie parser, express.json, express.static, express.urlencoded
app.use(express.json()); // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(express.static("public")); // Serve static files from "public" folder
app.use(cors()); // Enable CORS for cross-origin requests
app.use(cookieParser()); // Parse cookies from client requests

// Routes
// work will be on the route folder
app.use("/api/v1", require("./routes/index")); // Mount API routes at /api/v1

// Error Handling Middlewares
app.use(golbalErrorHandler); // Handle all errors centrally

module.exports = { app }; // Export the app instance
