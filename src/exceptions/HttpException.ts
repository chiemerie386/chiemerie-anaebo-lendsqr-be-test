// Custom exception class for handling HTTP errors
export class CustomHttpException extends Error { 
  public statusCode: number;
  public status: string;
  public message: string;

  // Constructor to initialize the HTTP error with a status code and message
  constructor(statusCode: number, errorMessage: string) {
    super(errorMessage); // Call the parent class constructor with the message
    this.status = 'error'; // Set the error status
    this.statusCode = statusCode; // Set the HTTP status code
    this.message = errorMessage; // Set the error message
  }
}
