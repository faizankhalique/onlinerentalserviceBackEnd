const express = require("express");
const router = express.Router();
const {
  RegisteredProduct,
  validateOwnerID
} = require("../models/registeredProducts");
router.get("/", async (req, res) => {
  const result = await RegisteredProduct.find().populate("owner");
  res.status(200).send(result);
});
router.post("/addvehicle", async (req, res) => {
  const body = req.body;
  const ownerId = body.ownerId;
  const vehicleId = body.vehicleId;
  const owner = await RegisteredProduct.findOne({
    _id: ownerId
  }).select("vehicles");
  if (!owner) return res.status(200).send("Invalid Owner Id");
  // console.log(owner);
  owner.vehicles.push(vehicleId);
  const result = await owner.save();
  // console.log(result);
  res.status(200).send(result);
  // match: { _id: "5d0e2492d964461abc19740f" },
  // options: { limit: 1 }
  // const { error } = validateOwnerID(body);
  // if (error) return res.status(400).send(error.details[0].message);
  // const registeredProduct = new RegisteredProduct({
  //   owner: body.owner
  // });
  // const result = await registeredProduct.save();
  // console.log(result);
});
module.exports = router;
