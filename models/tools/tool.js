const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const toolSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  toolName: {
    type: String,
    trim: true,
    required: true
  },
  company: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  dailyRent: {
    type: Number,
    min: 1,
    required: true
  },
  memberShipDuration: {
    type: String,
    trim: true,
    required: true
  },
  toolImages: [
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
const Tool = mongoose.model("Tool", toolSchema);
function validateTool(tool) {
  const schema = {
    requester: Joi.ObjectId().required(),
    toolName: Joi.string()
      .min(3)
      .max(256)
      .required(),
    company: Joi.string()
      .min(3)
      .max(256)
      .required(),
    description: Joi.string()
      .min(3)
      .max(256)
      .required(),
    dailyRent: Joi.number()
      .min(1)
      .required(),
    memberShipDuration: Joi.string().required(),
    toolImages: Joi.array().required()
  };
  return Joi.validate(tool, schema);
}

module.exports.Tool = Tool;
module.exports.validateTool = validateTool;
