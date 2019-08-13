const express = require("express");
const _ = require("lodash");
const router = express.Router();
const {
  VehicleBooking,
  validateVehicleBooking
} = require("../models/vehicleBooking");
const { Vehicle } = require("../models/vehicle");
router.get("/", async (req, res) => {
  const vehiclebookings = await VehicleBooking.find()
    .populate({ path: "renter" })
    .populate({ path: "vehicle" })
    .populate({ path: "owner" });

  res.status(200).send(vehiclebookings);
});
router.get("/:id", async (req, res) => {
  const renter = req.params.id;
  const vehiclebookings = await VehicleBooking.find({
    renter: renter
  }).populate({ path: "vehicle" });

  res.status(200).send(vehiclebookings);
});
router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  // const { error } = validateVehicleBooking(body);
  // if (error) return res.status(400).send(error.details[0].message);
  const vehicleBooking = await VehicleBooking.findByIdAndUpdate(
    { _id: _id },
    {
      security: body.security,
      rent: body.rent,
      startDate: body.startDate,
      endDate: body.endDate,
      startTime: body.startTime,
      endTime: body.startTime,
      bookingDate: new Date().toLocaleDateString(),
      bookingConfirmation: "Confirm"
    }
  );
  const result = await vehicleBooking.save();
  await Vehicle.findByIdAndUpdate(
    { _id: vehicleBooking.vehicle },
    { onRent: true }
  );
  res.status(200).send(result);
});
module.exports = router;
