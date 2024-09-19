import { Router } from 'express';
import { AppRoutes } from '@interfaces/routes.interface';
import HealthCheckController from '@/controllers/health.controller';

// Route for health check endpoints
class HealthCheckRoute implements AppRoutes { 
  public basePath = '/'; 
  public expressRouter = Router(); 
  public healthCheckController = new HealthCheckController();

  constructor() {
    this.registerHealthCheckRoutes(); 
  }

  // Register health check routes
  private registerHealthCheckRoutes() { 
    this.expressRouter.get(`${this.basePath}`, this.healthCheckController.checkHealth); // Default health check
    this.expressRouter.get(`${this.basePath}health`, this.healthCheckController.checkHealth); // Explicit /health check
  }
}

export default HealthCheckRoute; 
