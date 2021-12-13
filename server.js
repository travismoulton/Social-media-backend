const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.openStdin('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!, Shutting down...');
  console.log(err.name, err.message);
  // On uncaught exceptions we need to terminate immediatley.
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const { DATABASE, DB_PASSWORD } = process.env;

const app = require('./app');

const DB = DATABASE.replace('<password>', DB_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
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
