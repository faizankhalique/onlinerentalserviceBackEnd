const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const shopBookingSchema = new mongoose.Schema({
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
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
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
const ShopBooking = mongoose.model("ShopBooking", shopBookingSchema);
function validateShopBooking(shopBooking) {
  const schema = {
    renter: Joi.objectId().required(),
    owner: Joi.objectId(),
    shop: Joi.objectId().required(),
    purpose: Joi.string().required(),
    security: Joi.number().min(1),
    rent: Joi.number().min(1),
    endDate: Joi.string().required(),
    startDate: Joi.string().required()
  };
  return Joi.validate(shopBooking, schema);
}
module.exports.ShopBooking = ShopBooking;
module.exports.validateShopBooking = validateShopBooking;
