const express = require("express");
const router = express.Router();
const { AllRegisteredRenters } = require("../models/allRegisterRenters");
router.get("/all", async (req, res) => {
  const renterDetails = await AllRegisteredRenters.find()
    .populate({
      path: "renter"
      // match: { age: { $gte: 21 }},
      // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
      // select: "fullName  -_id"
      // options: { limit: 5 }
    })
    .populate({
      path: "vehiclesBookings",
      // Get vehicles of vehicless - populate the 'vehicles' array for every vehicle
      populate: { path: "vehiclesBookings" }
    })
    .populate({
      path: "housesBookings",
      populate: { path: "housesBookings" }
    })
    .populate({
      path: "shopsBookings",
      populate: { path: "shopsBookings" }
    });
  res.status(200).send(renterDetails);
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const renterDetails = await AllRegisteredRenters.findById(id)
    .populate({
      path: "renter"
      // match: { age: { $gte: 21 }},
      // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
      // select: "fullName  -_id"
      // options: { limit: 5 }
    })
    .populate({
      path: "vehiclesBookings",
      // Get vehicles of vehicless - populate the 'vehicles' array for every vehicle
      populate: { path: "vehiclesBookings" }
    })
    .populate({
      path: "housesBookings",
      populate: { path: "housesBookings" }
    })
    .populate({
      path: "shopsBookings",
      populate: { path: "shopsBookings" }
    });
  if (!renterDetails) return res.status(404).send("Renter Details not found");

  const totalVehiclesBookings = renterDetails.vehiclesBookings.length;
  res.status(200).send({
    renter: renterDetails.renter,
    totalVehiclesBookings
  });
});
router.post("/addvehiclebooking", async (req, res) => {
  const body = req.body;
  const renterId = body.renterId;
  const bookingId = body.bookingId;
  const renter = await AllRegisteredRenters.findOne({
    _id: renterId
  }).select("vehiclesBookings");
  if (!renter) return res.status(200).send("Invalid renter Id");
  let updateVehiclesBookings = renter.vehiclesBookings.filter(
    vb => vb != bookingId
  );
  updateVehiclesBookings.push(bookingId);
  renter.vehiclesBookings = updateVehiclesBookings;
  const result = await renter.save();
  res.status(200).send(result);
});
router.post("/addhousebooking", async (req, res) => {
  const body = req.body;
  const renterId = body.renterId;
  const bookingId = body.bookingId;
  const renter = await AllRegisteredRenters.findOne({
    _id: renterId
  }).select("housesBookings");
  if (!renter) return res.status(200).send("Invalid renter Id");
  let updateHousesBookings = renter.housesBookings.filter(
    hb => hb != bookingId
  );
  updateHousesBookings.push(bookingId);
  renter.housesBookings = updateHousesBookings;
  const result = await renter.save();
  res.status(200).send(result);
});
router.post("/addshopbooking", async (req, res) => {
  const body = req.body;
  const renterId = body.renterId;
  const bookingId = body.bookingId;
  const renter = await AllRegisteredRenters.findOne({
    _id: renterId
  }).select("shopsBookings");
  if (!renter) return res.status(200).send("Invalid renter Id");
  let updateShopsBookings = renter.shopsBookings.filter(sb => sb != bookingId);
  updateShopsBookings.push(bookingId);
  renter.shopsBookings = updateShopsBookings;
  const result = await renter.save();
  res.status(200).send(result);
});
module.exports = router;
