const express = require("express");
const bycrpt = require("bcrypt");
const mongoose = require("mongoose");
const deletFile = require("../utils/deleteFile");
const _ = require("lodash");
const { User, validateUser } = require("../models/users");
const {
  RegisteredProduct,
  validateOwnerID
} = require("../models/registeredProducts");
const { AllRegisteredRenters } = require("../models/allRegisterRenters");
const auth = require("../middleware/auth");
const router = express.Router();
router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
});
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  const user = await User.findById(_id);
  if (!user) return res.status(404).send("user not found");
  res.status(200).send(user);
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
  if (result.accountType === "productowner") {
    const registeredProduct = new RegisteredProduct({
      owner: result._id
    });
    registeredProduct._id = result._id;
    const r = await registeredProduct.save();
  }
  if (result.accountType === "renter") {
    const allRegisterRenters = new AllRegisteredRenters({
      renter: result._id
    });
    allRegisterRenters._id = result._id;
    const r = await allRegisterRenters.save();
  }
  res
    .status(200)
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(result, ["fullName", "email", "accountType"]));
});
router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const user = await User.findById(_id);
  if (!user) return res.status(404).send("User not found");
  if (user.email !== body.email) {
    const nuser = await User.findOne({ email: body.email });
    if (nuser) return res.status(400).send("user email Already Exist");
  }
  if (user.cnicNo !== body.cnicNo) {
    const nuser = await User.findOne({ cnicNo: body.cnicNo });
    if (nuser) return res.status(400).send("user cnicNo Already Exist");
  }
  if (user.phoneNo !== body.phoneNo) {
    const nuser = await User.findOne({ phoneNo: body.phoneNo });
    if (nuser) return res.status(400).send("user phonNo Already Exist");
  }
  if (JSON.stringify(user.userImage) != JSON.stringify(body.userImage)) {
    let path =
      "F:/8th semester/FYP/Online Rental Service/router-app/public" +
      user.userImage.trim();
    deletFile(path);
  }
  const salt = await bycrpt.genSalt(10);
  const hashPassword = await bycrpt.hash(body.password, salt);
  const result = await User.findByIdAndUpdate(
    { _id: _id },
    {
      fullName: body.fullName,
      cnicNo: body.cnicNo,
      email: body.email,
      gender: body.gender,
      phoneNo: body.phoneNo,
      address: body.address,
      password: hashPassword,
      userImage: body.userImage
    }
  );
  res.status(200).send(result);
});
module.exports = router;
