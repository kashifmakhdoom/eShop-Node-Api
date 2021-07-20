# How to use
- Please follow the below steps to use the app;

## Clone and Initialize the Project
- At project root open the terminal/cmd and run 'npm install' or 'yarn' to initialize and download the necessary packages.

## Configure Environment Variables
- Create .env.local file at the project root and set environment variables as follows;

  PORT = 3000
  API_BASE_URL = /api/v1
  NODE_ENV = development
  LOCAL_MONGODB_URI = {MONGODB_URI}
  SECRET_KEY = {YOUR_SECRET}

## Run the Project
- At the terminal run 'npm start' or 'yarn start'
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Testing the Project
- At the terminal run 'npm test' or 'yarn test'
