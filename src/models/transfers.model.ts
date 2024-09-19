import { Model, ModelObject } from 'objection';
import { Transfer } from '@/interfaces/transfer.interface';
import { UserTransactionModel } from './transactions.model'; 

// Model for interacting with the transfers table
export class TransferModel extends Model implements Transfer { 
  id!: number;
  sourceTransactionId!: number;
  destinationTransactionId!: number;
  createdAt!: Date;
  updatedAt!: Date;
  deleted!: Boolean;

  // Define the table name and the ID column
  static tableName = 'transfers';
  static idColumn = 'id';

  // Define relationships to the transactions model
  static get relationMappings() {
    return {
      source: {
        relation: Model.HasOneRelation,
        modelClass: UserTransactionModel,
        join: {
          from: `transactions.id`,
          to: 'transfers.sourceTransactionId',
        },
      },
      destination: {
        relation: Model.HasOneRelation,
        modelClass: UserTransactionModel,
        join: {
          from: `transactions.id`,
          to: 'transfers.destinationTransactionId',
        },
      },
    };
  }
}

// Type for the TransferModel
export type TransferModelShape = ModelObject<TransferModel>; 
