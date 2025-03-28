const mongoose = require("mongoose");
const config = require("config");
const error = require("../middleware/error");

module.exports = function () {
  mongoose
    .connect(config.get("mongoUri"))
    .then(() => console.log("Mongo db connected successfully"))
    .catch((err) => {
      if (!config.get("mongoUri")) {
        console.error("MongoDB URI is not defined in environment variables!");
        process.exit(1);
      }
      console.log("Could not connect to database");
      console.log(err);
    });
};
