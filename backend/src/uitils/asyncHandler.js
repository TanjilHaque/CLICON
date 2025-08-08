exports.asyncHandler = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res);
    } catch (error) {
      console.log("Error from asyncHanlder function");
      next(error);
    }
  };
};
