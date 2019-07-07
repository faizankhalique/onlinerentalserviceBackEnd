const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function(req, res, next) {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. no token provided");
    const payload = jwt.verify(token, config.get("jwtPrivateKey"));

    if (payload) req.user = payload;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};
