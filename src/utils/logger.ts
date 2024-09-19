import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { LOG_DIR } from '@config';

// Define the directory for log files
const loggingDirectory: string = join(__dirname, LOG_DIR); 

// Create the directory if it doesn't exist
if (!existsSync(loggingDirectory)) {
  mkdirSync(loggingDirectory);
}

// Define the log format with a custom timestamp and message format
const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

// Create the logger instance
const appLogger = winston.createLogger({ 
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: loggingDirectory + '/debug',
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: loggingDirectory + '/error',
      filename: `%DATE%.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

// Add console logging with colorized output
appLogger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
  }),
);

// Stream for integrating with other logging systems (e.g., morgan)
const logStream = { 
  write: (message: string) => {
    appLogger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { appLogger as logger, logStream as stream }; 
