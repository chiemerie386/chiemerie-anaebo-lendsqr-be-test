import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewUserRegistrationDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  public password: string;
}

export class UserLoginDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}
