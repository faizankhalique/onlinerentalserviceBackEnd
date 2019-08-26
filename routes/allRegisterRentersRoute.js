const express = require("express");
const router = express.Router();
const { AllRegisteredRenters } = require("../models/allRegisterRenters");
const { Vehicle } = require("../models/vehicle");
const { VehicleBooking } = require("../models/vehicleBooking");
const { Tool } = require("../models/tools/tool");
const { ToolBooking } = require("../models/tools/toolBooking");
const { House } = require("../models/Properties/house");
const { HouseBooking } = require("../models/Properties/houseBooking");
const { Shop } = require("../models/Properties/shop");
const { ShopBooking } = require("../models/Properties/shopBooking");
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
  let vehiclesOnRent = 0;
  let todayVehiclesEndBookings = 0;
  let housesOnRent = 0;
  let todayHousesEndBookings = 0;
  let shopsOnRent = 0;
  let todayShopsEndBookings = 0;
  let toolsOnRent = 0;
  let todayToolsEndBookings = 0;
  const currentDate = new Date(new Date().toLocaleDateString() + ",00:00");
  for (const renterDetail of renterDetails) {
    // console.log(renterDetail.renter.fullName, renterDetail.vehiclesBookings);
    // console.log("\n");
    for (const vehiclesBooking of renterDetail.vehiclesBookings) {
      const endDate = new Date(vehiclesBooking.endDate + ",00:00");
      if (
        currentDate > endDate &&
        vehiclesBooking.payment.security > 0 &&
        vehiclesBooking.bookingStatus == "Confirm"
      ) {
        await Vehicle.findByIdAndUpdate(vehiclesBooking.vehicle, {
          onRent: false
        });
        await VehicleBooking.findByIdAndUpdate(vehiclesBooking._id, {
          bookingStatus: "Complete"
        });
      }
      if (
        currentDate.toString() == endDate.toString() &&
        vehiclesBooking.payment.security > 0 &&
        vehiclesBooking.bookingStatus == "Confirm"
      ) {
        todayVehiclesEndBookings++;
      }
      if (vehiclesBooking.bookingStatus == "Confirm") {
        vehiclesOnRent++;
      }
    }
    for (const toolsBooking of renterDetail.toolsBookings) {
      const endDate = new Date(toolsBooking.endDate + ",00:00");
      if (
        currentDate > endDate &&
        toolsBooking.payment.security > 0 &&
        toolsBooking.bookingStatus == "Confirm"
      ) {
        await Tool.findByIdAndUpdate(toolsBooking.tool, {
          onRent: false
        });
        await ToolBooking.findByIdAndUpdate(toolsBooking._id, {
          bookingStatus: "Complete"
        });
      }
      if (
        currentDate.toString() == endDate.toString() &&
        toolsBooking.payment.security > 0 &&
        toolsBooking.bookingStatus == "Confirm"
      ) {
        todayToolsEndBookings++;
      }
      if (toolsBooking.bookingStatus == "Confirm") {
        toolsOnRent++;
      }
    }
    for (const housesBooking of renterDetail.housesBookings) {
      const endDate = new Date(housesBooking.endDate + ",00:00");
      if (
        currentDate > endDate &&
        housesBooking.security > 0 &&
        housesBooking.payments.length > 0 &&
        housesBooking.bookingStatus == "Confirm"
      ) {
        await House.findByIdAndUpdate(housesBooking.house, {
          onRent: false
        });
        await HouseBooking.findByIdAndUpdate(housesBooking._id, {
          bookingStatus: "Complete"
        });
      }
      if (
        currentDate.toString() == endDate.toString() &&
        housesBooking.security > 0 &&
        housesBooking.payments.length > 0 &&
        housesBooking.bookingStatus == "Confirm"
      ) {
        todayHousesEndBookings++;
      }
      if (housesBooking.bookingStatus == "Confirm") {
        housesOnRent++;
      }
    }
    for (const shopsBooking of renterDetail.shopsBookings) {
      const endDate = new Date(shopsBooking.endDate + ",00:00");
      if (
        currentDate > endDate &&
        shopsBooking.security > 0 &&
        shopsBooking.payments.length > 0 &&
        shopsBooking.bookingStatus == "Confirm"
      ) {
        await Shop.findByIdAndUpdate(shopsBooking.shop, {
          onRent: false
        });
        await ShopBooking.findByIdAndUpdate(shopsBooking._id, {
          bookingStatus: "Complete"
        });
      }
      if (
        currentDate.toString() == endDate.toString() &&
        shopsBooking.security > 0 &&
        shopsBooking.payments.length > 0 &&
        shopsBooking.bookingStatus == "Confirm"
      ) {
        todayShopsEndBookings++;
      }
      if (shopsBooking.bookingStatus == "Confirm") {
        shopsOnRent++;
      }
    }
  }
  // console.log("todayShopsEndBookings :", todayShopsEndBookings);
  // console.log("shopsOnRent :", shopsOnRent);
  res.status(200).send({
    renterDetails,
    bookingsDetails: {
      vehiclesOnRent,
      todayVehiclesEndBookings,
      housesOnRent,
      todayHousesEndBookings,
      shopsOnRent,
      todayShopsEndBookings,
      toolsOnRent,
      todayToolsEndBookings
    }
  });
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

module.exports = router;
