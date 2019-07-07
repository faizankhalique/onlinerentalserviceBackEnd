const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const { Vehicle, validateVehicle } = require("../models/vehicle");
const router = express.Router();
router.get("/", async (req, res) => {
  const vehicles = await Vehicle.find();
  res.status(200).send(vehicles);
});
router.get("/vehiclesimages", async (req, res) => {
  let images = [];
  const vehiclesimages = await Vehicle.find().select({ vehicleImages: 1 });
  for (const object of vehiclesimages) {
    for (const image of object.vehicleImages) {
      images.push(image);
    }
  }
  res.status(200).send(images);
});
router.post("/", async (req, res) => {
  const body = req.body;
  // console.log(body);
  const { error } = validateVehicle(body);
  if (error) return res.status(400).send(error.details[0].message);
  let vehicle = await Vehicle.findOne({ vehicleNo: body.vehicleNo });
  if (vehicle) return res.status(400).send("vehicleNo Already Exist");
  vehicle = new Vehicle(
    _.pick(body, [
      "vehicleName",
      "vehicleModel",
      "vehicleNo",
      "vehicleCompany",
      "fuelType",
      "vehicleType",
      "vehicleColour",
      "seatCapacity",
      "vehicleImages",
      "vehicleRent",
      "memberShipDuration"
    ])
  );
  // vehicle.vehicleImages = body.vehicleImages;
  const result = await vehicle.save();
  res.status(200).send(result._id);
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const valid = mongoose.Types.ObjectId.isValid(id);
  if (!valid) return res.status(400).send("Invalid Vehicle id");
  const vehicle = await Vehicle.findById(id);
  console.log("vehicle", vehicle);
  if (!vehicle) return res.status(404).send("Vehicle Not Exist with this id");
  res.status(200).send(vehicle);
});
module.exports = router;
