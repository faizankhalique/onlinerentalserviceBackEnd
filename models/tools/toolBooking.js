const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const toolBookingSchema = new mongoose.Schema({
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
  tool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tool",
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
const ToolBooking = mongoose.model("ToolBooking", toolBookingSchema);
function validateToolBooking(toolBooking) {
  const schema = {
    renter: Joi.objectId().required(),
    owner: Joi.objectId(),
    tool: Joi.objectId().required(),
    purpose: Joi.string().required(),
    security: Joi.number().min(1),
    rent: Joi.number().min(1),
    endDate: Joi.string().required(),
    startDate: Joi.string().required()
  };
  return Joi.validate(toolBooking, schema);
}
module.exports.ToolBooking = ToolBooking;
module.exports.validateToolBooking = validateToolBooking;
