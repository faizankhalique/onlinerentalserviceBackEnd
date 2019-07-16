const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const vehicleRentRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  licenseNo: {
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
  status: {
    type: String,
    default: "Not-Approved"
  },
  requestDate: {
    type: Date,
    default: new Date()
  },
  ApprovedDate: {
    type: Date
  }
});
const VehicleRentRequest = mongoose.model(
  "VehicleRentRequest",
  vehicleRentRequestSchema
);
function validateVehicleRentRequest(params) {
  const schema = {
    requester: Joi.objectId().required(),
    duration: Joi.string().required(),
    purpose: Joi.string().required(),
    licenseNo: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required()
  };
  return Joi.validate(params, schema);
}
module.exports.VehicleRentRequest = VehicleRentRequest;
module.exports.validateVehicleRentRequest = validateVehicleRentRequest;
