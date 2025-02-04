import { config } from 'dotenv';
config({ path: `.env` });
console.log('Environment:', process.env.NODE_ENV);

export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, SECRET_KEY, LOG_FORMAT, LOG_DIR } = process.env;
