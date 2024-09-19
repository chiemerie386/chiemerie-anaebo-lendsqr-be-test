import { NewUserRegistrationDto } from '@/dtos/users.dto';
import { User } from '@/interfaces/user.interface';
import UserAuthService from '@/services/auth.service'; 
import { NextFunction, Request, Response } from 'express';
import blacklistService from '../adjutor/index'; // Blacklist checking service

// Controller for handling user authentication
class UserAuthController { 
  public userAuthService = new UserAuthService(); 

  // Register a new user
  public registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => { 
    try {
      const newUserData: NewUserRegistrationDto = req.body; 
      const isBlacklisted = await blacklistService.checkBlacklistStatus(req.body.email); 

      if (isBlacklisted) {
        res.status(400).json({
          status: 'error',
          message: 'This user has been blacklisted',
          data: null,
        });
        return;
      }

      const newUser: User = await this.userAuthService.registerUser(newUserData);
      res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  };

  // Log in a user
  public loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => { 
    try {
      const loginData: NewUserRegistrationDto = req.body; 
      const { token, user } = await this.userAuthService.loginUser(loginData); 

      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: { token, user },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserAuthController; 
