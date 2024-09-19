import { hashSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { NewUserRegistrationDto } from '@dtos/users.dto';
import { CustomHttpException } from '@exceptions/HttpException';
import { AuthTokenData, AuthTokenResponse } from '@interfaces/auth.interface'; 
import { User } from '@/interfaces/user.interface';
import { UserModel } from '@models/users.model'; 

// Service for handling user authentication
class UserAuthService { 
  // Register a new user
  public async registerUser(newUserData: NewUserRegistrationDto): Promise<User> { 
    if (!newUserData) throw new CustomHttpException(400, 'Sign-up information is required');

    // Check if the user already exists
    const existingUser: User = await UserModel.query()
      .select()
      .from('users')
      .where({ email: newUserData.email, deleted: false })
      .first();

    if (existingUser) throw new CustomHttpException(409, `User already exists`);

    // Create a new user with a hashed password
    const newUser: User = await UserModel.query().insertAndFetch({
      ...newUserData,
      password: hashSync(newUserData.password, 10),
    });

    return newUser;
  }

  // Log in a user and return the token and user data
  public async loginUser(loginData: NewUserRegistrationDto): Promise<{ token: AuthTokenResponse; user: User }> { 
    if (!loginData) throw new CustomHttpException(400, 'Login credentials are required');

    // Find the user by email
    const user: User = await UserModel.query()
      .select()
      .from('users')
      .where({ email: loginData.email, deleted: false })
      .first();

    // Validate the password
    if (!user || !user.password || !compareSync(loginData.password, user.password)) {
      throw new CustomHttpException(409, 'Invalid login credentials');
    }

    // Generate a JWT token
    const token = this.generateAuthToken(user); 

    return { token, user };
  }

  // Generate a JWT token for the user
  public generateAuthToken(user: User): AuthTokenResponse { 
    const dataStoredInToken: AuthTokenData = { id: user.id }; 
    const secretKey: string = SECRET_KEY;
    const tokenExpiry = 60 * 60; // Token expiration in seconds

    return { expiresIn: tokenExpiry, token: sign(dataStoredInToken, secretKey, { expiresIn: tokenExpiry }) };
  }
}

export default UserAuthService; 
