const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const houseBookingSchema = new mongoose.Schema({
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  house: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "House",
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  security: {
    type: Number,
    min: 0,
    default: 0
  },
  rent: {
    type: Number,
    min: 0,
    default: 0
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  guests: {
    type: Number,
    min: 0,
    required: true
  },
  bookingDate: {
    type: String
  },
  bookingConfirmation: {
    type: String,
    default: "Pending"
  },
  status: {
    type: String,
    default: "Pending"
  },
  requestDate: {
    type: String,
    default: new Date().toLocaleDateString()
  },
  requestTime: {
    type: String,
    default: new Date().toLocaleTimeString()
  },
  ApprovedDate: {
    type: String
  },
  ApprovedTime: {
    type: String
  }
});
const HouseBooking = mongoose.model("HouseBooking", houseBookingSchema);
function validateHouseBooking(houseBooking) {
  const schema = {
    renter: Joi.objectId().required(),
    owner: Joi.objectId(),
    house: Joi.objectId().required(),
    purpose: Joi.string().required(),
    guests: Joi.number().required(),
    security: Joi.number().min(1),
    rent: Joi.number().min(1),
    endDate: Joi.string().required(),
    startDate: Joi.string().required()
  };
  return Joi.validate(houseBooking, schema);
}
module.exports.HouseBooking = HouseBooking;
module.exports.validateHouseBooking = validateHouseBooking;
