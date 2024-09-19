import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CustomHttpException } from '@exceptions/HttpException';
import { AuthTokenData, AuthenticatedRequest } from '@interfaces/auth.interface'; 
import { User } from '@interfaces/user.interface';
import { UserModel } from '@models/users.model';

// Middleware for authenticating users via JWT
const jwtAuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => { 
  try {
    // Extract the token from the Authorization header
    const authorizationHeader = req.header('Authorization');
    const token = authorizationHeader ? authorizationHeader.split('Bearer ')[1] : null;

    if (!token) return next(new CustomHttpException(401, 'Unauthorized'));

    const secretKey: string = SECRET_KEY;
    const tokenPayload = (await verify(token, secretKey)) as AuthTokenData;
    const authenticatedUserId = tokenPayload.id; 
    const authenticatedUser: User = await UserModel.query().findById(authenticatedUserId);

    if (!authenticatedUser) return next(new CustomHttpException(401, 'Unauthorized'));

    // Attach the authenticated user to the request
    req.user = authenticatedUser;
    next();
  } catch (error) {
    next(new CustomHttpException(401, 'Unauthorized'));
  }
};

export default jwtAuthMiddleware; 
