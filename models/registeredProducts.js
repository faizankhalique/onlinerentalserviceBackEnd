const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const RegisteredProduct = mongoose.model(
  "RegisteredProduct",
  new mongoose.Schema({
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    vehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle"
      }
    ],
    houses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "House"
      }
    ],
    shops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
      }
    ],
    tools: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tool"
      }
    ]
  })
);
function validateOwnerID(params) {
  const Schema = {
    owner: Joi.objectId().required()
  };
  return Joi.validate(params, Schema);
}
module.exports.RegisteredProduct = RegisteredProduct;
module.exports.validateOwnerID = validateOwnerID;
