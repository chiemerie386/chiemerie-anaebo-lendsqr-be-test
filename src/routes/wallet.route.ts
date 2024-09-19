import { Router } from 'express';
import { AppRoutes } from '@interfaces/routes.interface';
import WalletManagementController from '@/controllers/wallet.controller';
import authenticationMiddleware from '@/middlewares/auth.middleware';
import requestValidationMiddleware from '@/middlewares/validation.middleware';
import { UserWalletFundingDto, UserFundsTransferDto, UserWalletWithdrawalDto } from '@/dtos/wallets.dto';

class WalletManagementRoute implements AppRoutes {
  public basePath = '/wallet/';
  public expressRouter = Router();
  public walletManager = new WalletManagementController();
  constructor() {
    this.registerWalletRoutes(); 
  }

  // Method for registering wallet routes
  private registerWalletRoutes() {
    this.expressRouter.get(
      `${this.basePath}`,
      authenticationMiddleware,
      this.walletManager.getWalletDetails
    );
    this.expressRouter.post(
      `${this.basePath}fund`,
      authenticationMiddleware,
      requestValidationMiddleware(UserWalletFundingDto, 'body'),
      this.walletManager.fundUserWallet
    );
    this.expressRouter.post(
      `${this.basePath}withdraw`,
      authenticationMiddleware,
      requestValidationMiddleware(UserWalletWithdrawalDto, 'body'),
      this.walletManager.withdrawUserFunds
    );
    this.expressRouter.post(
      `${this.basePath}transfer`,
      authenticationMiddleware,
      requestValidationMiddleware(UserFundsTransferDto, 'body'),
      this.walletManager.transferUserFunds
    );
    this.expressRouter.get(
      `${this.basePath}transactions`,
      authenticationMiddleware,
      this.walletManager.getUserTransactions
    );
  }
}

export default WalletManagementRoute;
