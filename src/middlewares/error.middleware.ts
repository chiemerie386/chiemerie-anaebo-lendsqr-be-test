import { NextFunction, Request, Response } from 'express';
import { CustomHttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';

// Middleware to handle application errors
const customErrorHandler = (error: CustomHttpException, req: Request, res: Response, next: NextFunction) => { 
  try {
    const statusCode: number = error.statusCode || 500;  // Get status code or default to 500
    const errorMessage: string = error.message || 'Unknown Error';  // Get the error message or default to 'Unknown Error'

    // Log the error details
    logger.error(`[${req.method}] [${req.path}] [${statusCode}] [${errorMessage}]`);

    // Send a JSON response with the error details
    res.status(statusCode).json({
      status: error.status,
      message: errorMessage,
    });
  } catch (error) {
    next(error);  // Pass the error to the next middleware
  }
};

export default customErrorHandler; 
