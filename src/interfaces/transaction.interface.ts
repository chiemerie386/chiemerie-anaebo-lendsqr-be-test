// Interface representing a user's transaction
export interface UserTransaction { 
  id: number;          // Unique identifier for the transaction
  amount: number;      // Amount involved in the transaction
  userId: number;      // ID of the user who performed the transaction
  type: string;        // Type of transaction (e.g., fund, withdraw, transfer)
  status: string;      // Current status of the transaction (e.g., pending, success)
  direction: string;   // Direction of transaction (credit or debit)
  createdAt: Date;     // Timestamp when the transaction was created
  updatedAt: Date;     // Timestamp when the transaction was last updated
  deleted: Boolean;    // Soft delete flag
}
