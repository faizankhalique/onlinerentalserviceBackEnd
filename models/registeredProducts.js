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
    ]
    // Houses:{
    //     type:[new mongoose.Schema({})]
    // },
    // shops:{
    //     type:[new mongoose.Schema({})]
    // },
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
