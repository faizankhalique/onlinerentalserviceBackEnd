const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");
module.exports = async function() {
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
  mongoose
    .connect(`mongodb://localhost/${config.get("DataBase_Name")}`, {
      useNewUrlParser: true
    })
    .then(() => {
      winston.info(`DataBase Connection Successfully:`);
    })
    .catch(err => {
      winston.error(`DataBase Connection Error:`, err.message);
    });
};
