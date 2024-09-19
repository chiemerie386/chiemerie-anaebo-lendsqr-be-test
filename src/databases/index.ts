import Knex from 'knex';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from '@config';

// Initialize the Knex database connection
const databaseConnection = Knex({ 
  client: 'mysql2',
  useNullAsDefault: true,
  connection: {
    charset: 'utf8',
    timezone: '+01:00',
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
  pool: {
    min: 2,
    max: 10,
  },
});

// Export the database connection
export default databaseConnection; 
