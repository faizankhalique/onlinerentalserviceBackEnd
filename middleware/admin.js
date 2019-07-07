const config = require("config");
module.exports = function(req, res, next) {
  if (config.get("authorization")) {
    if (req.user.accountType !== "admin")
      return res.status(403).send("Access denied.you are not admin");
  } else next();
};
