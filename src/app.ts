import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { Model } from 'objection';
import { NODE_ENV, PORT, LOG_FORMAT } from '@config';
import knex from '@databases';
import { AppRoutes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';

class ApplicationServer {
  public expressApp: express.Application;
  public environment: string;
  public applicationPort: string | number;

  constructor(apiRoutes: AppRoutes[]) {
    this.expressApp = express();
    this.environment = NODE_ENV || 'development';
    this.applicationPort = PORT || 3000;

    this.setupApplication();
    this.registerApiRoutes(apiRoutes);
    this.setupErrorHandling();
  }

  // Application setup method to group initialization tasks
  private setupApplication() {
    this.configureDatabase();
    this.configureMiddlewares();
  }

  // Starts the server and listens on the defined port
  public startServer() {
    return this.expressApp;
  }

  public getExpressApp() {
    return this.expressApp;
  }

  // Configures the database connection
  private configureDatabase() {
    Model.knex(knex);
  }

  // Middleware configuration with modularized methods
  private configureMiddlewares() {
    this.configureLogging();
    this.expressApp.use(cors({ origin: '*', credentials: true }));
    this.expressApp.use(hpp());
    this.expressApp.use(helmet());
    this.expressApp.use(compression());
    this.expressApp.use(express.json());
    this.expressApp.use(express.urlencoded({ extended: true }));
  }

  // Separate method for configuring logging middleware
  private configureLogging() {
    this.expressApp.use(morgan(LOG_FORMAT, { stream }));
  }

  // Registers API routes to the Express app
  private registerApiRoutes(apiRoutes: AppRoutes[]) {
    apiRoutes.forEach(route => {
      this.expressApp.use('/', route.expressRouter);
    });
    this.expressApp.use((req, res) =>
      res.status(404).send({
        status: 'error',
        message: `${req.method} ${req.originalUrl} Not Found`,
      })
    );
  }

  // Sets up global error handling middleware
  private setupErrorHandling() {
    this.expressApp.use(errorMiddleware);
  }
}

export default ApplicationServer;
