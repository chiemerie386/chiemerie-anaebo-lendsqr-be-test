import { Router } from 'express';

// Interface for defining route configurations
export interface AppRoutes { 
  path?: string; // Optional base path for the route
  expressRouter: Router; // Express router handling the route
}
