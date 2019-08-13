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
router.get("/all", async (req, res) => {
  const ownerDetails = await RegisteredProduct.find()
    .populate({
      path: "owner"
      // match: { age: { $gte: 21 }},
      // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
      // select: "fullName  -_id"
      // options: { limit: 5 }
    })
    .populate({
      path: "vehicles",
      // Get vehicles of vehicless - populate the 'vehicles' array for every vehicle
      populate: { path: "vehicles" }
    })
    .populate({
      path: "houses",
      populate: { path: "houses" }
    })
    .populate({
      path: "shops",
      populate: { path: "shops" }
    });
  // console.log(ownerDetails[0].owner);
  // console.log(ownerDetails[0].vehicles);
  res.status(200).send(ownerDetails);
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  let vehiclesOnRent = 0;
  let freeVehicles = 0;
  const ownerDetails = await RegisteredProduct.findById(id)
    .populate({
      path: "owner"
      // match: { age: { $gte: 21 }},
      // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
      // select: "fullName  -_id"
      // options: { limit: 5 }
    })
    .populate({
      path: "vehicles",
      // Get vehicles of vehicless - populate the 'vehicles' array for every vehicle
      populate: { path: "vehicles" }
    });
  if (!ownerDetails)
    return res.status(404).send("Product_Owner Details not found");
  for (const vehicle of ownerDetails.vehicles) {
    if (vehicle.onRent) vehiclesOnRent++;
    if (!vehicle.onRent) freeVehicles++;
  }
  const totalVehicles = ownerDetails.vehicles.length;
  res.status(200).send({
    productOwner: ownerDetails.owner,
    totalVehicles,
    vehiclesOnRent,
    freeVehicles
  });
});
router.get("/ownervehicles/:id", async (req, res) => {
  const id = req.params.id;
  const ownerVehicles = await RegisteredProduct.findById(id).populate({
    path: "vehicles",
    // Get vehicles of vehicless - populate the 'vehicles' array for every vehicle
    populate: { path: "vehicles" }
  });
  if (!ownerVehicles)
    return res.status(404).send("Vehicles Owner Details not found");

  res.status(200).send(ownerVehicles.vehicles);
});
router.get("/ownerhouses/:id", async (req, res) => {
  const id = req.params.id;
  const ownerHouses = await RegisteredProduct.findById(id).populate({
    path: "houses",
    populate: { path: "houses" }
  });
  if (!ownerHouses)
    return res.status(404).send(" House Owner Details not found");

  res.status(200).send(ownerHouses.houses);
});
router.get("/ownershops/:id", async (req, res) => {
  const id = req.params.id;
  const ownerShops = await RegisteredProduct.findById(id).populate({
    path: "shops",
    populate: { path: "shops" }
  });
  if (!ownerShops) return res.status(404).send(" Shop Owner Details not found");

  res.status(200).send(ownerShops.shops);
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
router.post("/addhouse", async (req, res) => {
  const body = req.body;
  const ownerId = body.ownerId.trim();
  const houseId = body.houseId.trim();
  const owner = await RegisteredProduct.findOne({
    _id: ownerId
  }).select("houses");
  if (!owner) return res.status(200).send("Invalid Owner Id");
  owner.houses.push(houseId);
  const result = await owner.save();
  res.status(200).send("result");
});
router.post("/addshop", async (req, res) => {
  const body = req.body;
  const ownerId = body.ownerId.trim();
  const shopId = body.shopId.trim();
  const owner = await RegisteredProduct.findOne({
    _id: ownerId
  }).select("shops");
  if (!owner) return res.status(200).send("Invalid Owner Id");
  owner.shops.push(shopId);
  const result = await owner.save();
  res.status(200).send("result");
});
module.exports = router;
