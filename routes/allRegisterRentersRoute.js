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
    })
    .populate({
      path: "toolsBookings",
      populate: { path: "toolsBookings" }
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
    })
    .populate({
      path: "toolsBookings",
      populate: { path: "toolsBookings" }
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
  if (!renter) return res.status(404).send("Invalid renter Id");
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
  if (!renter) return res.status(404).send("Invalid renter Id");
  let updateShopsBookings = renter.shopsBookings.filter(sb => sb != bookingId);
  updateShopsBookings.push(bookingId);
  renter.shopsBookings = updateShopsBookings;
  const result = await renter.save();
  res.status(200).send(result);
});
router.post("/addtoolbooking", async (req, res) => {
  const body = req.body;
  const renterId = body.renterId;
  const bookingId = body.bookingId;
  const renter = await AllRegisteredRenters.findOne({
    _id: renterId
  }).select("toolsBookings");
  if (!renter) return res.status(404).send("Invalid renter Id");
  let updateToolsBookings = renter.toolsBookings.filter(tb => tb != bookingId);
  updateToolsBookings.push(bookingId);
  renter.toolsBookings = updateToolsBookings;
  const result = await renter.save();
  res.status(200).send(result);
});
router.put("/createhousePayment/:id", async (req, res) => {
  const body = req.body;
  const renterId = req.params.id;

  const renter = await AllRegisteredRenters.findOne({
    _id: renterId
  }).select("housePayments");

  if (!renter) return res.status(200).send("Invalid renter Id");
  let updateHousePayments = renter.housePayments.filter(tb => tb != bookingId);
  updateHousePayments.push(body);
  renter.housePayments = updateHousePayments;
  const result = await renter.save();
  res.status(200).send(result);
});
router.put("/addhousePayment/:id", async (req, res) => {
  const body = req.body;
  const rent = {
    rent: body.rent,
    month: body.month,
    commission: body.commission,
    date: new Date().toLocaleString()
  };
  console.log(rent);
  const renterId = req.params.id;

  const renter = await AllRegisteredRenters.findOne({
    _id: renterId
  }).select("housePayments");
  if (!renter) return res.status(200).send("Invalid renter Id");
  console.log("renter", renter);
  renter.housePayments[0].rents.push(rent);
  renter.housePayments[0].security = body.security;

  const result = await renter.save();
  res.status(200).send(result);
});
router.get("/renterhousePayments/:id", async (req, res) => {
  const renterId = req.params.id;

  const renter = await AllRegisteredRenters.findOne({
    _id: renterId
  }).select("housePayments");
  if (!renter) return res.status(200).send("Invalid renter Id");
  let rents = renter.housePayments[0].rents;
  res.status(200).send(rents);
});

router.put("/createshopPayment/:id", async (req, res) => {
  const body = req.body;
  const renterId = req.params.id;

  const renter = await AllRegisteredRenters.findOne({
    _id: renterId
  }).select("shopPayments");

  if (!renter) return res.status(200).send("Invalid renter Id");
  // let updateShopPayments = renter.shopPayments.filter(tb => tb != bookingId);
  renter.shopPayments.push(body);
  const result = await renter.save();
  res.status(200).send(result);
});
router.put("/addshopPayment/:id", async (req, res) => {
  const body = req.body;
  const rent = {
    rent: body.rent,
    month: body.month,
    commission: body.commission,
    date: new Date().toLocaleString()
  };
  const renterId = req.params.id;

  const renter = await AllRegisteredRenters.findOne({
    _id: renterId
  }).select("shopPayments");
  if (!renter) return res.status(200).send("Invalid renter Id");
  renter.shopPayments[0].rents.push(rent);
  renter.shopPayments[0].security = body.security;
  const result = await renter.save();
  res.status(200).send(result);
});
router.get("/rentershopPayments/:id", async (req, res) => {
  const renterId = req.params.id;

  const renter = await AllRegisteredRenters.findOne({
    _id: renterId
  }).select("shopPayments");
  if (!renter) return res.status(200).send("Invalid renter Id");
  let rents = renter.shopPayments[0].rents;
  res.status(200).send(rents);
});

module.exports = router;
