const express = require("express");
const router = express.Router();
const { RegisteredProduct } = require("../models/registeredProducts");
const { AllRegisteredRenters } = require("../models/allRegisterRenters");
router.get("/productsdata", async (req, res) => {
  let totalVehicles = 0;
  let totalTools = 0;
  let totalHouses = 0;
  let totalShops = 0;
  let totalVehiclesOnRent = 0;
  let totalToolsOnRent = 0;
  let totalHousesOnRent = 0;
  let totalShopsOnRent = 0;
  let totalVehiclesFree = 0;
  let totalToolsFree = 0;
  let totalHousesFree = 0;
  let totalShopsFree = 0;
  const ownerDetails = await RegisteredProduct.find()
    .populate({
      path: "owner"
    })
    .populate({
      path: "vehicles",

      populate: { path: "vehicles" }
    })
    .populate({
      path: "houses",
      populate: { path: "houses" }
    })
    .populate({
      path: "shops",
      populate: { path: "shops" }
    })
    .populate({
      path: "tools",
      populate: { path: "tools" }
    });

  for (let ownerDetail of ownerDetails) {
    totalVehicles = totalVehicles + ownerDetail.vehicles.length;
    for (const vehicle of ownerDetail.vehicles) {
      if (vehicle.onRent === true) totalVehiclesOnRent++;
      if (vehicle.onRent === false) totalVehiclesFree++;
    }
    totalHouses = totalHouses + ownerDetail.houses.length;
    for (const house of ownerDetail.houses) {
      if (house.onRent === true) totalHousesOnRent++;
      if (house.onRent === false) totalHousesFree++;
    }
    totalShops = totalShops + ownerDetail.shops.length;
    for (const shop of ownerDetail.shops) {
      if (shop.onRent === true) totalShopsOnRent++;
      if (shop.onRent === false) totalShopsFree++;
    }
    totalTools = totalTools + ownerDetail.tools.length;
    for (const tool of ownerDetail.tools) {
      if (tool.onRent === true) totalToolsOnRent++;
      if (tool.onRent === false) totalToolsFree++;
    }
  }
  //   console.log("totalVehicles :", totalVehicles);
  //   console.log("totalHouses :", totalHouses);
  //   console.log("totalShops :", totalShops);
  //   console.log("totalTools :", totalTools);
  //   console.log("totalVehicles :", totalVehicles);
  //   console.log("totalVehiclesOnRent :", totalVehiclesOnRent);
  //   console.log("totalVehiclesfree :", totalVehiclesFree);
  //   console.log("totalHousesOnRent :", totalHousesOnRent);
  //   console.log("totalHousesFree :", totalHousesFree);
  //   console.log("totalShopsOnRent :", totalShopsOnRent);
  //   console.log("totalShopsFree :", totalShopsFree);
  //   console.log("totalToolsOnRent :", totalToolsOnRent);
  //   console.log("totalToolsFree :", totalToolsFree);
  //   console.log("Owner :", ownerDetails[0].owner.fullName);
  //   console.log(ownerDetails[0].vehicles);

  res.status(200).send({
    totalVehicles,
    totalTools,
    totalShops,
    totalHouses,
    totalVehiclesOnRent,
    totalVehiclesFree,
    totalHousesOnRent,
    totalHousesFree,
    totalShopsOnRent,
    totalShopsFree,
    totalToolsOnRent,
    totalToolsFree
  });
});
router.get("/allmonthsprofits", async (req, res) => {
  const renterDetails = await AllRegisteredRenters.find()
    .populate({
      path: "renter"
    })
    .populate({
      path: "vehiclesBookings",
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
  let allMonthsProfits = [];
  let totalProfit = 0;
  let vehiclesProfit = 0;
  let housesProfit = 0;
  let shopsProfit = 0;
  let toolsProfit = 0;
  let l = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Nov",
    "Oct",
    "Dec"
  ];

  for (let index = 1; index <= 12; index++) {
    let profit = 0;
    for (const renterDetail of renterDetails) {
      for (const vehicleBooking of renterDetail.vehiclesBookings) {
        let month = new Date(vehicleBooking.bookingDate).getMonth() + 1;
        if (month === index) {
          profit = profit + vehicleBooking.payment.commission;
          vehiclesProfit = vehiclesProfit + vehicleBooking.payment.commission;
        }
      }
      //<-------------------------->
      for (const toolBooking of renterDetail.toolsBookings) {
        let month = new Date(toolBooking.bookingDate).getMonth() + 1;
        if (month === index) {
          profit = profit + toolBooking.payment.commission;
          toolsProfit = toolsProfit + toolBooking.payment.commission;
        }
      }
      //<-------------------->
      for (const houseBooking of renterDetail.housesBookings) {
        for (const payment of houseBooking.payments) {
          let month = new Date(payment.paymentDate).getMonth() + 1;
          if (month === index) {
            profit = profit + payment.monthlyCommission;
            housesProfit = housesProfit + payment.monthlyCommission;
          }
        }
      }
      //<----------------------->
      for (const shopBooking of renterDetail.shopsBookings) {
        for (const payment of shopBooking.payments) {
          let month = new Date(payment.paymentDate).getMonth() + 1;
          if (month === index) {
            profit = profit + payment.monthlyCommission;
            shopsProfit = shopsProfit + payment.monthlyCommission;
          }
        }
      }
    }
    allMonthsProfits.push({ label: l[index - 1], y: profit });
    totalProfit = totalProfit + profit;
  }
  res.status(200).send({
    allMonthsProfits,
    totalProfit,
    vehiclesProfit,
    housesProfit,
    shopsProfit,
    toolsProfit
  });
});
module.exports = router;
