const config = require("config");
module.exports = function() {
  if (!config.get("jwtPrivateKey")) {
    winston.error("FATAL ERROR:jwtPrivateKey not set");
    process.exit(1);
  }
};
