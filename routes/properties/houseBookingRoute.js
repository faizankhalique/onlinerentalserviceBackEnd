const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { RegisteredProduct } = require("../../models/registeredProducts");
const {
  HouseBooking,
  validateHouseBooking
} = require("../../models/Properties/houseBooking");
const { House } = require("../../models/Properties/house");
router.get("/houseRentRequests", async (req, res) => {
  const houseRentRequests = await HouseBooking.find()
    .populate("renter")
    .populate("house")
    .populate("owner");
  res.status(200).send(houseRentRequests);
});
router.get("/houseRentRequest/:id", async (req, res) => {
  const houseRentRequests = await HouseBooking.find().populate("house");
  res.status(200).send(houseRentRequests);
});
router.get("/housebookings/:id", async (req, res) => {
  const renter = req.params.id;
  const houseRentRequests = await HouseBooking.find({
    renter: renter,
    bookingConfirmation: "Confirm"
  }).populate("house");
  res.status(200).send(houseRentRequests);
});
router.post("/houseRentRequest", async (req, res) => {
  const body = req.body; //request body
  const houseId = body.house;
  let ownerId = ""; //house owner
  const { error } = validateHouseBooking(body);
  if (error) return res.status(400).send(error.details[0].message);
  let houseRentRequest = await HouseBooking.findOne({
    renter: body.renter
  });
  if (houseRentRequest)
    return res.status(400).send("You have Already submit House Rent Request");
  const registeredProducts = await RegisteredProduct.find().select({
    houses: 1
  });
  //geting the owner of the house
  for (const registeredProduct of registeredProducts) {
    for (const house of registeredProduct.houses) {
      if (houseId == house) {
        ownerId = registeredProduct._id;
      }
    }
  }
  houseRentRequest = new HouseBooking(
    _.pick(body, [
      "renter",
      "house",
      "purpose",
      "guests",
      "startDate",
      "endDate"
    ])
  );
  houseRentRequest.owner = ownerId;
  const result = await houseRentRequest.save();
  res.status(200).send(result);
});
router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;

  const houseBooking = await HouseBooking.findByIdAndUpdate(
    { _id: _id },
    {
      security: body.security,
      rent: body.rent,
      startDate: body.startDate,
      endDate: body.endDate,
      bookingDate: new Date().toLocaleDateString(),
      bookingConfirmation: "Confirm"
    }
  );
  const result = await houseBooking.save();
  await House.findByIdAndUpdate(
    { _id: houseBooking.house._id },
    { onRent: true }
  );
  res.status(200).send(result);
});
router.put("/approvedrentrequest/:id", async (req, res) => {
  const id = req.params.id;
  let request = await HouseBooking.findOne({ _id: id });
  if (!request)
    return res.status(404).send("HouseRentRequest with this id not Exist");
  request.status = "Approved";
  request.ApprovedDate = new Date().toLocaleDateString();
  request.ApprovedTime = new Date().toLocaleTimeString();
  const result = await request.save();
  res.status(200).send(result);
});
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  const result = await HouseBooking.findByIdAndDelete(_id);
  if (!result)
    return res.status(404).send("HouseBooking Given by Id not found");
  res.status(200).send(result);
});
module.exports = router;
