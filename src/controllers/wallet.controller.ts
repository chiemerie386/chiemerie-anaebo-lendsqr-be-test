import { NextFunction, Response } from 'express';
import WalletManagementService from '@services/wallet.service'; 
import { UserWallet } from '@/interfaces/wallet.interface';
import { AuthenticatedRequest } from '@/interfaces/auth.interface';
import { UserTransaction } from '@/interfaces/transaction.interface';
import { UserWalletFundingDto, UserFundsTransferDto, UserWalletWithdrawalDto } from '@/dtos/wallets.dto';

class WalletManagementController { 
  public walletServiceInstance = new WalletManagementService(); 

  // Fetches wallet details
  public getWalletDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userWallet: UserWallet = await this.walletServiceInstance.fetchUserWallet(req.user);
      res.status(200).json({
        status: 'success',
        message: 'Wallet fetched successfully',
        data: userWallet,
      });
    } catch (error) {
      next(error);
    }
  };

  // Handles wallet funding
  public fundUserWallet = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fundData: UserWalletFundingDto = req.body;
      const updatedWallet: UserWallet = await this.walletServiceInstance.fundUserWallet(req.user, fundData);
      res.status(200).json({
        status: 'success',
        message: 'Wallet funded successfully',
        data: updatedWallet,
      });
    } catch (error) {
      next(error);
    }
  };

  // Handles wallet withdrawals
  public withdrawUserFunds = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const withdrawalData: UserWalletWithdrawalDto = req.body;
      const updatedWallet: UserWallet = await this.walletServiceInstance.withdrawUserFunds(req.user, withdrawalData);
      res.status(200).json({
        status: 'success',
        message: 'Funds withdrawn successfully',
        data: updatedWallet,
      });
    } catch (error) {
      next(error);
    }
  };

  // Handles funds transfer
  public transferUserFunds = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transferData: UserFundsTransferDto = req.body;
      const updatedWallet: UserWallet = await this.walletServiceInstance.transferUserFunds(req.user, transferData);
      res.status(200).json({
        status: 'success',
        message: 'Funds transferred successfully',
        data: updatedWallet,
      });
    } catch (error) {
      next(error);
    }
  };

  // Fetches transaction history
  public getUserTransactions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userTransactions: UserTransaction[] = await this.walletServiceInstance.fetchUserTransactions(req.user);
      res.status(200).json({
        status: 'success',
        message: 'Transactions fetched successfully',
        data: userTransactions,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default WalletManagementController;
