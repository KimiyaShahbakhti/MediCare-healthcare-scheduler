const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const allAPIs = require("./api");

const app = express();

module.exports = class Application {
  constructor() {
    this.configServer();
    this.setConfig();
    this.configDatabase();
  }

  configServer() {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());

    app.use("/", allAPIs);

    const PORT = 8080;
    app.listen(PORT, console.log(`Server started on port ${PORT}`));

  }

  setConfig() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
  }

  configDatabase() {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.database.url);
  }
};
