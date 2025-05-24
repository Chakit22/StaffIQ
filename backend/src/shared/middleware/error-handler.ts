import { Request, Response, NextFunction } from "express";

// Custom error so that I can pass status code to the error handler
export interface ApiError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("errorHandler middleware");
  console.error(err.stack);

  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(status).json({
    success: false,
    body: null,
    message: message,
  });
};

export default errorHandler;
