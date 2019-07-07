require("express-async-errors");
const express = require("express");
const users = require("../routes/usersRoute");
const userImage = require("../routes/userImagesRoute");
const productImages = require("../routes/productImagesRoute");
const vehicles = require("../routes/vehicleRoute");
const vehicleRequest = require("../routes/vehicleRequestRoute");
const registertedProduct = require("../routes/registeredProductsRoute");
const email = require("../routes/sendEmailRoute");
const auth = require("../routes/authRoute");
const errors = require("../middleware/errors");
module.exports = function(app) {
  app.use(express.json()); //use for parse the body comming from request
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/vehicles", vehicles);
  app.use("/api/userimages", userImage);
  app.use("/api/vehiclerequest", vehicleRequest);
  app.use("/api/registerdproducts", registertedProduct);
  app.use("/api/sendemail", email);
  app.use("/api/productimages", productImages);
  app.use(errors);
};
