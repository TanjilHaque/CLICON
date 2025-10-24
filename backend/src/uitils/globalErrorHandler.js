require("dotenv").config();

//development error response
const developmentErrorResponse = (error, res) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    statusCode: error.statusCode,
    status: error.status,
    isOperationalError: error.isOperationalError,
    message: error.message,
    errorStack: error.stack,
  });
};

//production error response
const productionErrorResponse = (error, res) => {
  const statusCode = error.statusCode || 500;
  if (error.isOperationalError) {
    return res.status(statusCode).json({
      statusCode: error.statusCode,
      status: error.status,
    });
  } else {
    return res.status(statusCode).json({
      status: "OK!",
      message: "Something went wrong try again...",
    });
  }
};

exports.globalErrorHandler = (error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    developmentErrorResponse(error, res);
  }
  if (process.env.NODE_ENV === "production") {
    productionErrorResponse(error, res);
  }
};
