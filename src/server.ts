import ApplicationServer from '@/app';
import HealthCheckRoute from '@/routes/health.route';
import validateEnvironment from '@utils/validateEnv';
import AuthenticationRoute from '@routes/auth.route';
import WalletManagementRoute from './routes/wallet.route';

// Validate environment variables
validateEnvironment();

// Initialize the application with routes
const serverApp = new ApplicationServer([
  new HealthCheckRoute(),
  new AuthenticationRoute(),
  new WalletManagementRoute(),
]);

// Set the port from environment or use the default value
const serverPort = process.env.PORT || 3000;

// Start the server and listen on the specified port
serverApp.getExpressApp().listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
