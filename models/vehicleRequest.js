const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const VehicleRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  vehicleName: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    required: true
  },
  vehicleModel: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    required: true
  },
  vehicleNo: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    trim: true,
    required: true
  },
  vehicleCompany: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    required: true
  },
  vehicleType: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    required: true
  },
  vehicleColour: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    required: true
  },
  seatCapacity: {
    type: Number,
    min: 4,
    required: true
  },
  fuelType: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    required: true
  },
  vehicleImages: [
    {
      type: String,
      trim: true,
      required: true
    }
  ],
  vehicleRent: {
    type: Number,
    min: 1,
    required: true
  },
  memberShipDuration: {
    type: String,
    trim: true,
    required: true
  },
  status: {
    type: String,
    default: "Not-Approved"
  },
  requestDate: {
    type: String,
    default: new Date().toLocaleString()
  },
  ApprovedDate: {
    type: String
  },
  ApprovedTime: {
    type: String
  }
});
const VehicleRequest = mongoose.model("VehicleRequest", VehicleRequestSchema);
function validateVehicleRequest(request) {
  const schema = {
    requester: Joi.objectId().required(),
    vehicleName: Joi.string()
      .min(3)
      .max(255)
      .required(),
    vehicleModel: Joi.string()
      .min(3)
      .max(255)
      .required(),
    vehicleNo: Joi.string()
      .min(5)
      .max(255)
      .required(),
    vehicleCompany: Joi.string()
      .min(3)
      .max(255)
      .required(),
    vehicleType: Joi.string()
      .min(3)
      .max(255)
      .required(),
    vehicleColour: Joi.string()
      .min(3)
      .max(255)
      .required(),
    seatCapacity: Joi.number()
      .min(4)
      .required(),
    fuelType: Joi.string()
      .min(3)
      .max(255)
      .required(),
    vehicleImages: Joi.array().required(),
    vehicleRent: Joi.number()
      .min(1)
      .required(),
    memberShipDuration: Joi.string().required()
  };
  return Joi.validate(request, schema);
}
module.exports.VehicleRequest = VehicleRequest;
module.exports.validateVehicleRequest = validateVehicleRequest;
