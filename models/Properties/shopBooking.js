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
  bookingStatus: {
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
  },
  totalMonths: { type: Number, default: 0 },
  security: { type: Number, default: 0 },
  payments: [
    {
      currentMonth: { type: Number, default: 0 },
      monthlyRent: { type: Number, default: 0 },
      monthlyCommission: { type: Number, default: 0 },
      ownerMonthlyRent: { type: Number, default: 0 },
      paidToOwnerDate: { type: String },
      paidToOwnerStatus: { type: Boolean, default: false },
      paymentDate: { type: String }
    }
  ]
});
const ShopBooking = mongoose.model("ShopBooking", shopBookingSchema);
function validateShopBooking(shopBooking) {
  const schema = {
    renter: Joi.objectId().required(),
    owner: Joi.objectId(),
    shop: Joi.objectId().required(),
    purpose: Joi.string().required(),
    endDate: Joi.string().required(),
    startDate: Joi.string().required()
  };
  return Joi.validate(shopBooking, schema);
}
module.exports.ShopBooking = ShopBooking;
module.exports.validateShopBooking = validateShopBooking;
