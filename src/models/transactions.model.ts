import { Model, ModelObject } from 'objection';
import { UserTransaction } from '@/interfaces/transaction.interface'; 
import { TransferModel } from './transfers.model'; 
import { UserModel } from './users.model'; 

// Model for interacting with the transactions table
export class UserTransactionModel extends Model implements UserTransaction { 
  id!: number;
  amount!: number;
  userId!: number;
  type!: string;
  status!: string;
  direction!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deleted!: Boolean;

  // Define the table name and the ID column
  static tableName = 'transactions';
  static idColumn = 'id';

  // Define relationships to other models
  static get relationMappings() {
    return {
      transferSource: {
        relation: Model.HasOneRelation,
        modelClass: TransferModel,
        join: {
          from: `transactions.id`,
          to: 'transfers.sourceTransactionId',
        },
      },
      transferDestination: {
        relation: Model.HasOneRelation,
        modelClass: TransferModel,
        join: {
          from: `transactions.id`,
          to: 'transfers.destinationTransactionId',
        },
      },
      user: {
        relation: Model.HasOneRelation,
        modelClass: UserModel,
        join: {
          from: `transactions.userId`,
          to: 'users.id',
        },
      },
    };
  }

  // Format the JSON response, adjusting relationships and removing unneeded fields
  $formatJson(json) {
    json = super.$formatJson(json);
    if (json?.transferSource?.destination?.user) {
      json.destination = json.transferSource.destination.user;
    }
    if (json?.transferDestination?.source?.user) {
      json.source = json.transferDestination.source.user;
    }
    delete json.transferSource;
    delete json.transferDestination;
    return json;
  }
}

// Type for the UserTransaction model
export type UserTransactionModelShape = ModelObject<UserTransactionModel>; 
