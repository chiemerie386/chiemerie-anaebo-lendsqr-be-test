import { Request } from 'express';
import { User } from '@/interfaces/user.interface';

// Data stored in the authentication token
export interface AuthTokenData { 
  id: number; // User ID stored in the token
}

// Structure for the token response
export interface AuthTokenResponse { 
  token: string;      // The authentication token
  expiresIn: number;  // Token expiration time in seconds
}

// Extended Express request object to include user data
export interface AuthenticatedRequest extends Request { 
  user: User; // Authenticated user data
}
