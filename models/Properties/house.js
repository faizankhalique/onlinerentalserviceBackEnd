const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const houseSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  city: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 256,
    required: true
  },
  location: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 256,
    required: true
  },
  area: {
    type: Number,
    min: 1,
    required: true
  },
  portions: {
    type: Number,
    min: 1,
    required: true
  },
  bedRooms: {
    type: Number,
    min: 1,
    required: true
  },
  kitchens: {
    type: Number,
    min: 1,
    required: true
  },
  baths: {
    type: Number,
    min: 1,
    required: true
  },
  lawn: {
    type: String,
    required: true
  },
  monthlyRent: {
    type: Number,
    min: 1,
    required: true
  },
  memberShipDuration: {
    type: String,
    trim: true,
    required: true
  },
  houseImages: [
    {
      type: String,
      trim: true,
      required: true
    }
  ],
  registered: {
    type: Boolean,
    default: false
  },
  onRent: {
    type: Boolean,
    default: false
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
function validateHouse(house) {
  const schema = {
    requester: Joi.ObjectId().required(),
    city: Joi.string()
      .min(3)
      .max(256)
      .required(),
    location: Joi.string()
      .min(3)
      .max(256)
      .required(),
    area: Joi.number()
      .min(1)
      .required(),
    portions: Joi.number()
      .min(1)
      .required(),
    bedRooms: Joi.number()
      .min(1)
      .required(),
    kitchens: Joi.number()
      .min(1)
      .required(),
    baths: Joi.number()
      .min(1)
      .required(),
    lawn: Joi.string().required(),
    monthlyRent: Joi.number()
      .min(1)
      .required(),
    memberShipDuration: Joi.string().required(),
    houseImages: Joi.array().required()
  };
  return Joi.validate(house, schema);
}
const House = mongoose.model("House", houseSchema);
module.exports.House = House;
module.exports.validateHouse = validateHouse;
