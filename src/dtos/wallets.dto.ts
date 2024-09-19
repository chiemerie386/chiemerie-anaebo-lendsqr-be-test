import { IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';

// DTO for funding the wallet
export class UserWalletFundingDto { 
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  public amount: number;
}

// DTO for withdrawing from the wallet
export class UserWalletWithdrawalDto { 
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  public amount: number;
}

// DTO for transferring funds to another user
export class UserFundsTransferDto { 
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  public amount: number;

  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
