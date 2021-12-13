const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`App running on prt ${port}...`);
});
