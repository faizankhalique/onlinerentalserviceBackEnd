const express = require("express");
const bycrpt = require("bcrypt");
const mongoose = require("mongoose");
const _ = require("lodash");
const { User, validateUser } = require("../models/users");
const {
  RegisteredProduct,
  validateOwnerID
} = require("../models/registeredProducts");
const auth = require("../middleware/auth");
const router = express.Router();
router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
});
router.get("/me", auth, async (req, res) => {
  res.status(200).send(req.user);
});
router.post("/", async (req, res) => {
  const body = req.body;
  console.log(body);
  const { error } = validateUser(body); //valdation of request body
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: body.email }); //check for email not exist
  if (user) return res.status(400).send("Email Already Exist");
  user = await User.findOne({ cnicNo: body.cnicNo }); //check for cnic not exist
  if (user) return res.status(400).send("CNIC-NO Already Exist");
  user = await User.findOne({ phoneNo: body.phoneNo }); //check for phone-no not exist
  if (user) return res.status(400).send("PhoneNo Already Exist");
  const salt = await bycrpt.genSalt(10);
  const hashPassword = await bycrpt.hash(body.password, salt);
  user = new User(
    _.pick(body, [
      "fullName",
      "email",
      "address",
      "phoneNo",
      "gender",
      "password",
      "accountType",
      "cnicNo",
      "userImage"
    ])
  );
  user.password = hashPassword;
  const result = await user.save();
  const token = user.getAuthToken();
  console.log(result);
  if (result.accountType === "productowner") {
    const registeredProduct = new RegisteredProduct({
      owner: result._id
    });
    registeredProduct._id = result._id;
    const r = await registeredProduct.save();
    console.log(r);
  }
  res
    .status(200)
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(result, ["fullName", "email", "accountType"]));
});
module.exports = router;
