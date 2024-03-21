
const ApiError = require("./apiError.js")

const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
      try {
        await Promise.resolve(requestHandler(req, res, next));
      } catch (error) {
        if (error instanceof ApiError) {
          return res.status(error.statusCode).json({
            message: error.message,
            success: false,
            errors: error.errors,
          });
        }
        next(error);
      }
    };
  };
  
module.exports = asyncHandler