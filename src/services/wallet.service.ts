import { User } from '@/interfaces/user.interface';
import { UserWalletModel } from '@/models/wallets.model';
import { UserWallet } from '@/interfaces/wallet.interface';
import { UserWalletFundingDto, UserFundsTransferDto, UserWalletWithdrawalDto } from '@/dtos/wallets.dto';
import { raw } from 'objection';
import { UserTransactionModel } from '@/models/transactions.model';
import { CustomHttpException } from '@/exceptions/HttpException';
import { UserModel } from '@/models/users.model';
import { TransferModel } from '@/models/transfers.model';
import { UserTransaction } from '@/interfaces/transaction.interface';

class WalletManagementService { 
  // Fetch the wallet for a user or create one if it doesn't exist
  public async fetchUserWallet(user: User): Promise<UserWalletModel> {
    let userWallet: UserWalletModel = await UserWalletModel.query().findOne({ userId: user.id, deleted: false });
    if (!userWallet) {
      userWallet = await UserWalletModel.query().insertAndFetch({ userId: user.id, balance: 0 });
    }
    return userWallet;
  }

  // Fetch a user by email
  public async fetchUserByEmailAddress(email: string): Promise<User> { // Renamed for clarity
    const foundUser: User = await UserModel.query().findOne({ email, deleted: false });
    if (!foundUser) throw new CustomHttpException(400, `Recipient not found`);
    return foundUser;
  }

  // Fund the user's wallet
  public async fundUserWallet(user: User, fundData: UserWalletFundingDto): Promise<UserWallet> {
    const trx = await UserWalletModel.startTransaction();
    try {
      let userWallet: UserWalletModel = await this.fetchUserWallet(user);
      const walletTransaction: UserTransactionModel = await UserTransactionModel.query(trx).insertAndFetch({
        userId: user.id,
        direction: 'credit',
        type: 'fund',
        status: 'pending',
        amount: +fundData.amount,
      });
      userWallet = await userWallet.$query(trx).patchAndFetch({ balance: raw('balance + :amount', { amount: +fundData.amount }) });

      await walletTransaction.$query(trx).patchAndFetch({ status: 'success' });
      await trx.commit();
      return userWallet;
    } catch (error) {
      await trx.rollback();
      throw new CustomHttpException(500, `Unable to fund wallet`);
    }
  }

  // Withdraw funds from the user's wallet
  public async withdrawUserFunds(user: User, withdrawalData: UserWalletWithdrawalDto): Promise<UserWallet> {
    const trx = await UserWalletModel.startTransaction();
    try {
      let userWallet: UserWalletModel = await this.fetchUserWallet(user);
      const withdrawalTransaction: UserTransactionModel = await UserTransactionModel.query(trx).insertAndFetch({
        userId: user.id,
        direction: 'debit',
        type: 'withdrawal',
        status: 'pending',
        amount: +withdrawalData.amount,
      });

      userWallet = await userWallet
        .$query(trx)
        .patchAndFetch({ balance: raw('balance - :amount', { amount: +withdrawalData.amount }) })
        .where('balance', '>=', +withdrawalData.amount);

      if (!userWallet) {
        await trx.rollback();
        throw new CustomHttpException(400, `Insufficient funds`);
      }

      await withdrawalTransaction.$query(trx).patchAndFetch({ status: 'success' });
      await trx.commit();
      return userWallet;
    } catch (error) {
      await trx.rollback();
      throw new CustomHttpException(500, `Unable to withdraw funds`);
    }
  }

  // Transfer funds to another user
  public async transferUserFunds(user: User, transferData: UserFundsTransferDto): Promise<UserWallet> {
    const trx = await UserWalletModel.startTransaction();
    try {
      const recipient: User = await this.fetchUserByEmailAddress(transferData.email);
      let senderWallet: UserWalletModel = await this.fetchUserWallet(user);

      const transferTransaction: UserTransactionModel = await UserTransactionModel.query(trx).insertAndFetch({
        userId: user.id,
        direction: 'debit',
        type: 'transfer',
        status: 'pending',
        amount: +transferData.amount,
      });

      senderWallet = await senderWallet
        .$query(trx)
        .patchAndFetch({ balance: raw('balance - :amount', { amount: +transferData.amount }) })
        .where('balance', '>=', +transferData.amount);

      if (!senderWallet) {
        await trx.rollback();
        throw new CustomHttpException(400, `Insufficient funds`);
      }

      const recipientWallet: UserWalletModel = await this.fetchUserWallet(recipient);
      const recipientTransaction: UserTransactionModel = await UserTransactionModel.query(trx).insertAndFetch({
        userId: recipient.id,
        direction: 'credit',
        type: 'transfer',
        status: 'pending',
        amount: +transferData.amount,
      });

      await recipientWallet.$query(trx).patchAndFetch({ balance: raw('balance + :amount', { amount: +transferData.amount }) });
      await recipientTransaction.$query(trx).patchAndFetch({ status: 'success' });

      await TransferModel.query(trx).insertAndFetch({
        sourceTransactionId: transferTransaction.id,
        destinationTransactionId: recipientTransaction.id,
      });

      await trx.commit();
      return senderWallet;
    } catch (error) {
      await trx.rollback();
      throw new CustomHttpException(500, `Unable to transfer funds`);
    }
  }

  // Fetch the transaction history for a user
  public async fetchUserTransactions(user: User): Promise<UserTransaction[]> {
    const userTransactions: UserTransaction[] = await UserTransactionModel.query()
      .where({ userId: user.id, deleted: false })
      .withGraphFetched({
        transferSource: { destination: { user: true } },
        transferDestination: { source: { user: true } },
      });
    return userTransactions;
  }
}

export default WalletManagementService;
