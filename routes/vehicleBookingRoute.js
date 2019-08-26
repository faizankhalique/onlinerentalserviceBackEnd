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
  })
    .populate({ path: "renter" })
    .populate({ path: "vehicle" })
    .populate({ path: "owner" });

  res.status(200).send(vehiclebookings);
});
router.get("/vehiclebooking/:id", async (req, res) => {
  const _id = req.params.id;
  const vehiclebooking = await VehicleBooking.findById(_id)
    .populate({ path: "vehicle" })
    .populate({ path: "owner" });
  if (!vehiclebooking) return res.status(404).send("vehicle booking Not found");
  res.status(200).send(vehiclebooking);
});
router.put("/confirmbooking/:id", async (req, res) => {
  const _id = req.params.id;
  const vehicleBooking = await VehicleBooking.findById(_id);
  if (!vehicleBooking) return res.status(404).send("vehicleBooking not found");
  vehicleBooking.bookingDate = new Date().toLocaleDateString();
  vehicleBooking.bookingStatus = "Confirm";
  const result = await vehicleBooking.save();
  await Vehicle.findByIdAndUpdate(
    { _id: vehicleBooking.vehicle },
    { onRent: true }
  );
  res.status(200).send(result);
});
router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const vehicleBooking = await VehicleBooking.findByIdAndUpdate(
    { _id: _id },
    {
      payment: {
        totalDays: body.totalDays,
        totalRent: body.totalRent,
        commission: body.commission,
        ownerRent: body.ownerRent,
        security: body.security,
        ownerRent: body.ownerRent
      },
      startDate: body.startDate,
      endDate: body.endDate
    }
  );

  if (body.bookingStatus == "Complete") {
    vehicleBooking.bookingStatus = body.bookingStatus;
    await Vehicle.findByIdAndUpdate(body.vehicleId, {
      onRent: false
    });
  }
  const result = await vehicleBooking.save();
  res.status(200).send(result);
});
module.exports = router;
