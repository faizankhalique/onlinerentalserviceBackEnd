const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const vehicleBookingSchema = new mongoose.Schema({
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
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
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
  payment: {
    totalDays: { type: Number, default: 0 },
    totalRent: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    ownerRent: { type: Number, default: 0 },
    security: { type: Number, default: 0 },
    paidToOwnerDate: { type: String },
    paidToOwnerStatus: { type: Boolean, default: false }
  }
});
const VehicleBooking = mongoose.model("VehicleBooking", vehicleBookingSchema);
function validateVehicleBooking(vehicleBooking) {
  const schema = {
    renter: Joi.objectId().required(),
    owner: Joi.objectId().required(),
    vehicle: Joi.objectId().required(),
    purpose: Joi.string().required(),
    security: Joi.number().min(0),
    rent: Joi.number().min(0),
    startDate: Joi.string().required(),

    endDate: Joi.string().required()
  };
  return Joi.validate(vehicleBooking, schema);
}
module.exports.VehicleBooking = VehicleBooking;
module.exports.validateVehicleBooking = validateVehicleBooking;
