import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { CustomHttpException } from '@exceptions/HttpException';

// Middleware for validating request data against a DTO
const requestValidationMiddleware = (
  dtoClass: any,
  requestPart: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    // Validate the request data using the DTO class
    validate(plainToInstance(dtoClass, req[requestPart]), {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        // If there are validation errors, create a message and pass it to the error handler
        const errorMessage = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        next(new CustomHttpException(400, errorMessage));
      } else {
        next(); // Continue to the next middleware if validation passes
      }
    });
  };
};

export default requestValidationMiddleware;
