// Interface representing a user's wallet
export interface UserWallet { 
  id: number;          // Unique identifier for the wallet
  balance: number;     // Current balance in the wallet
  userId: number;      // ID of the user who owns the wallet
  createdAt: Date;     // Timestamp of wallet creation
  updatedAt: Date;     // Timestamp of last wallet update
  deleted: Boolean;    // Soft delete flag
}
