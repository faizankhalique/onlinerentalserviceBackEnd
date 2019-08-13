const express = require("express");
const _ = require("lodash");
const config = require("config");
const router = express.Router();
const deletFile = require("../../utils/deleteFile");
const { House, validateHouse } = require("../../models/Properties/house");
router.get("/houserequest", async (req, res) => {
  const houseRequests = await House.find().populate({ path: "requester" });
  res.status(200).send(houseRequests);
});
router.get("/ownerhouserequest/:id", async (req, res) => {
  const requester = req.params.id;
  const houseRequests = await House.find({ requester: requester });
  res.status(200).send(houseRequests);
});
router.get("/", async (req, res) => {
  const houses = await House.find({ registered: true, onRent: false });

  res.status(200).send(houses);
});
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  const house = await House.findById(_id);
  if (!house) return res.status(404).send("House By Given Id Not found");
  res.status(200).send(house);
});
router.post("/houserequest", async (req, res) => {
  const body = req.body;
  const { error } = validateHouse(body);
  if (error) return res.status(400).send(error.details[0].message);
  const houseRequest = new House(
    _.pick(body, [
      "requester",
      "city",
      "location",
      "area",
      "portions",
      "bedRooms",
      "kitchens",
      "baths",
      "lawn",
      "monthlyRent",
      "memberShipDuration",
      "houseImages"
    ])
  );
  const result = await houseRequest.save();
  res.status(200).send(result);
});
router.put("/approvedhouserequest/:id", async (req, res) => {
  const _id = req.params.id;
  const house = await House.findById(_id);
  if (!house) return res.status(404).send("House Given by Id not found");
  house.status = "Approved";
  house.ApprovedDate = new Date().toLocaleDateString();
  house.ApprovedTime = new Date().toLocaleTimeString();
  house.registered = true;
  const result = await house.save();
  res.status(200).send(result);
});
router.put("/updatehouserequest/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  let house = await House.findById(_id);
  if (!house) return res.status(404).send("House Given by Id not found");
  if (JSON.stringify(house.houseImages) != JSON.stringify(body.houseImages)) {
    console.log("not equal");
    for (const image of house.houseImages) {
      let path =
        "F:/8th semester/FYP/Online Rental Service/router-app/public" +
        image.trim();
      deletFile(path);
    }
  }
  house.requester = body.requester;
  house.city = body.city;
  house.location = body.location;
  house.area = body.area;
  house.portions = body.portions;
  house.bedRooms = body.bedRooms;
  house.kitchens = body.kitchens;
  house.baths = body.baths;
  house.lawn = body.lawn;
  house.monthlyRent = body.monthlyRent;
  house.memberShipDuration = body.memberShipDuration;
  house.houseImages = body.houseImages;
  const result = await house.save();
  res.status(200).send(result);
});
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  const house = await House.findById(_id);
  if (!house) return res.status(404).send("House Given by Id not found");
  for (const image of house.houseImages) {
    let path =
      "F:/8th semester/FYP/Online Rental Service/router-app/public" +
      image.trim();
    deletFile(path);
  }
  const result = await House.findByIdAndDelete(_id);
  res.status(200).send(result);
});
module.exports = router;
