# React Chakra UI Application with MongoDB and Firebase

This README provides instructions on how to set up and run the React application that uses Chakra UI, MongoDB, and Firebase.

## Prerequisites

- Node.js and npm installed
- MongoDB instance running
- Firebase project set up

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   REACT_APP_IN_DEV=true
   REACT_APP_API_ENDPOINT=http://localhost:8080
   REACT_APP_ENCRYPTION_KEY=<your-encryption-key>

   REACT_APP_FIREBASE_APIKEY=<your-firebase-api-key>
   REACT_APP_FIREBASE_AUTHDOMAIN=<your-firebase-auth-domain>
   REACT_APP_FIREBASE_PROJECTID=<your-firebase-project-id>
   REACT_APP_FIREBASE_STORAGEBUCKET=<your-firebase-storage-bucket>
   REACT_APP_FIREBASE_MESSAGEINGSENDERID=<your-firebase-messaging-sender-id>
   REACT_APP_FIREBASE_APPID=<your-firebase-app-id>
   REACT_APP_FIREBASE_MESURMENTID=<your-firebase-measurement-id>

   REACT_APP_AUTHORIZATION_HEADER_NAME=<your-auth-header-name>
   REACT_APP_X_AMZ_TRACE_ID=<your-amz-trace-id>
   REACT_APP_X_B3_SPANID_ID=<your-b3-spanid>
   REACT_APP_X_B3_TRACE_ID=<your-b3-traceid>
   ```

   Replace the placeholder values with your actual configuration details.

4. Ensure your MongoDB instance is running and accessible.

5. Configure your Firebase project and update the Firebase configuration in the app if necessary.

## Running the Application

To start the development server: