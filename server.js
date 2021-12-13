const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const { DATABASE, DB_PASSWORD } = process.env;

const app = require("./app");

const DB = DATABASE.replace("<password>", DB_PASSWORD);

mongoose.connect(DB).then(() => console.log("DB connection successful"));

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`App running on prt ${port}...`);
});
