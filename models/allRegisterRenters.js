const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const AllRegisteredRenters = mongoose.model(
  "AllRegisteredRenters",
  new mongoose.Schema({
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    vehiclesBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VehicleBooking"
      }
    ],
    housesBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HouseBooking"
      }
    ],
    shopsBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopBooking"
      }
    ],
    toolsBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ToolBooking"
      }
    ]
  })
);
function validateRenterID(params) {
  const Schema = {
    renterr: Joi.objectId().required()
  };
  return Joi.validate(params, Schema);
}
module.exports.AllRegisteredRenters = AllRegisteredRenters;
module.exports.validateRenterID = validateRenterID;
