import { Router } from 'express';
import { AppRoutes } from '@interfaces/routes.interface';
import UserAuthController from '@/controllers/auth.controller'; 
import requestValidationMiddleware from '@/middlewares/validation.middleware'; 
import { NewUserRegistrationDto, UserLoginDto } from '@/dtos/users.dto';

// Route for handling user authentication
class UserAuthRoute implements AppRoutes { 
  public basePath = '/auth/'; 
  public expressRouter = Router(); 
  public userAuthController = new UserAuthController(); 

  constructor() {
    this.registerAuthRoutes(); 
  }

  // Register authentication-related routes
  private registerAuthRoutes() { 
    this.expressRouter.post(
      `${this.basePath}register`,
      requestValidationMiddleware(NewUserRegistrationDto, 'body'), 
      this.userAuthController.registerUser, 
    );
    this.expressRouter.post(
      `${this.basePath}login`,
      requestValidationMiddleware(UserLoginDto, 'body'),
      this.userAuthController.loginUser, 
    );
  }
}

export default UserAuthRoute; 
