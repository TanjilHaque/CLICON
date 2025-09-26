console.log("we are in the custom error file");
const customError = class CustomError extends Error {
  constructor(statusCode, errorName, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = errorName;
    this.status =
      statusCode >= 400 && statusCode < 500 ? "Client Error" : "Server Error";
    this.message = message || "Server / Client Error";
    this.isOperationalError = true;
    this.data = null;
    Error.captureStackTrace(this, customError);
  }
};

module.exports = { customError };
