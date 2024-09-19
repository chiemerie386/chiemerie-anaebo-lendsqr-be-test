import { Model, ModelObject } from 'objection';
import { User } from '@/interfaces/user.interface';

// Model for interacting with the users table
export class UserModel extends Model implements User { 
  id!: number;
  email!: string;
  password!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deleted!: Boolean;

  // Define the table name and the ID column
  static tableName = 'users';
  static idColumn = 'id';

  // Format the JSON response, excluding the password field
  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password; // Remove password from the response
    return json;
  }
}

// Type for the Users model
export type UserModelShape = ModelObject<UserModel>; 
