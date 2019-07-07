const express = require("express");
const config = require("config");
const winston = require("winston");
const app = express();
require("./startup/dbConnection")(); //db connection.
require("./startup/logger"); //uncaught exceptions unhandledRejection.
require("./startup/prod")(app); //headers.
require("./startup/jwtKeySetting")(); //jwtPrivate key setting.
require("./startup/routes")(app); //Endpoint Routes.
const port = process.env.PORT || config.get("port");
app.listen(port, "localhost", () => {
  winston.info(`Server Listen at:${port}`);
});
