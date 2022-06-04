const express = require('express');
const connectDB = require('./config/db');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const reports = require('./routes/reports');
const errorHandler = require('./middleware/error');
// Load env variables
dotenv.config({ path: './config/config.env' });

const app = express();

// Body parser
app.use(express.json());

// Connect to database
connectDB();

// Dev logging middleware
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/v1/api/reports', reports);

app.use(errorHandler);

const PORT = process.env.PORT;

// Connecting to server
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on PORT: ${PORT}`.yellow
      .bold
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close server & exit process
  server.close(() => process.exit(1));
});
