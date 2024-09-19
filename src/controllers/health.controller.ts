import { NextFunction, Request, Response } from 'express';

// Controller for handling health check requests
class HealthCheckController { 
  // Health check method that responds with a 200 OK status
  public checkHealth = (req: Request, res: Response, next: NextFunction): void => { 
    try {
      res.sendStatus(200); // Send 200 OK status
    } catch (error) {
      next(error); // Pass errors to the next middleware
    }
  };
}

export default HealthCheckController; 
