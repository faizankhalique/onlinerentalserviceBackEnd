const mongoose = require("mongoose");
const Jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    required: true
  },
  email: {
    type: String,
    maxlength: 255,
    trim: true,
    unique: true,
    required: true
  },
  cnicNo: {
    type: String,
    maxlength: 15,
    minlength: 15,
    trim: true,
    unique: true,
    required: true
  },
  gender: {
    type: String,
    minlength: 4,
    lowercase: true,
    maxlength: 6,
    trim: true,
    required: true
  },
  address: {
    type: String,
    minlength: 3,
    lowercase: true,
    maxlength: 255,
    trim: true,
    required: true
  },
  phoneNo: {
    type: String,
    maxlength: 11,
    minlength: 11,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    required: true
  },
  accountType: {
    type: String,
    minlength: 3,
    lowercase: true,
    maxlength: 255,
    trim: true,
    required: true
  },
  userImage: {
    type: String,
    trim: true,
    required: true
  }
});
userSchema.methods.getAuthToken = function() {
  return Jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
      userImage: this.userImage,
      accountType: this.accountType
    },
    config.get("jwtPrivateKey")
  );
};
const User = mongoose.model("User", userSchema);
function validateUser(user) {
  const schema = {
    fullName: Joi.string()
      .min(3)
      .max(255)
      .required(),
    email: Joi.string()
      .email()
      .min(2)
      .max(255)
      .required(),
    password: Joi.string()
      .min(3)
      .max(255)
      .required(),
    gender: Joi.string()
      .min(3)
      .max(6)
      .required(),
    phoneNo: Joi.string()
      .min(11)
      .max(11)
      .required(),
    cnicNo: Joi.string()
      .min(15)
      .max(15)
      .required(),
    address: Joi.string()
      .min(3)
      .max(225)
      .required(),
    accountType: Joi.string()
      .min(2)
      .max(255)
      .required(),
    userImage: Joi.string().required()
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
