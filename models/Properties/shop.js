const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const shopSchema = new mongoose.Schema({
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
  shopImages: [
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
function validateShop(shop) {
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
    monthlyRent: Joi.number()
      .min(1)
      .required(),
    memberShipDuration: Joi.string().required(),
    shopImages: Joi.array().required()
  };
  return Joi.validate(shop, schema);
}
const Shop = mongoose.model("Shop", shopSchema);
module.exports.Shop = Shop;
module.exports.validateShop = validateShop;
