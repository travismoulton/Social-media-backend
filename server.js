const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Expirementing with https
const https = require('https');
const fs = require('fs');

process.openStdin('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!, Shutting down...');
  console.log(err.name, err.message);
  // On uncaught exceptions we need to terminate immediatley.
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const { DATABASE, DB_PASSWORD, PORT } = process.env;

const app = require('./app');

const DB = DATABASE.replace('<password>', DB_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

const port = PORT || 8080;

// const server = app.listen(port, () => {
//   console.log(`App running on prt ${port}...`);
// });

// Expirementing with https
const serverOptions = {
  key: fs.readFileSync('./PEM/127.0.0.1-key.pem'),
  cert: fs.readFileSync('./PEM/127.0.0.1.pem'),
};

const server = https.createServer(serverOptions, app);
server.listen(port, () => {
  console.log(`App running on prt ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION, SHUTTING DOWN...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process Terminated');
  });
});
