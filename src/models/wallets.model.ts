import { Model, ModelObject } from 'objection';
import { UserWallet } from '@/interfaces/wallet.interface'; 
import { UserModel } from './users.model'; 

// Model for interacting with the wallets table
export class UserWalletModel extends Model implements UserWallet { 
  id!: number;
  balance!: number;
  userId!: number;
  createdAt!: Date;
  updatedAt!: Date;
  deleted!: Boolean;

  // Define the table name and the ID column
  static tableName = 'wallets';
  static idColumn = 'id';

  // Define relationships to the users model
  static get relationMappings() {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: UserModel, 
        join: {
          from: `users.id`,
          to: 'wallets.userId',
        },
      },
    };
  }
}

// Type for the UserWalletModel
export type UserWalletModelShape = ModelObject<UserWalletModel>; 
