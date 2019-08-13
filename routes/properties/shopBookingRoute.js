const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { RegisteredProduct } = require("../../models/registeredProducts");
const {
  ShopBooking,
  validateShopBooking
} = require("../../models/Properties/shopBooking");
const { Shop } = require("../../models/Properties/shop");
router.get("/shoprentrequests", async (req, res) => {
  const shopRentRequests = await ShopBooking.find()
    .populate("renter")
    .populate("shop")
    .populate("owner");
  res.status(200).send(shopRentRequests);
});
router.get("/shopRentRequest/:id", async (req, res) => {
  const shopRentRequests = await ShopBooking.find().populate("shop");
  res.status(200).send(shopRentRequests);
});
router.get("/shopbookings/:id", async (req, res) => {
  const renter = req.params.id;
  const shopRentRequests = await ShopBooking.find({ renter: renter }).populate(
    "shop"
  );
  res.status(200).send(shopRentRequests);
});
router.get("/shopbookings/:id", async (req, res) => {
  const renter = req.params.id;
  const shopRentRequests = await ShopBooking.find({
    renter: renter,
    bookingConfirmation: "Confirm"
  }).populate("shop");
  res.status(200).send(shopRentRequests);
});
router.post("/shopRentRequest", async (req, res) => {
  const body = req.body; //request body
  const shopId = body.shop;
  let ownerId = ""; //shop owner
  const { error } = validateShopBooking(body);
  if (error) return res.status(400).send(error.details[0].message);
  let shopRentRequest = await ShopBooking.findOne({
    renter: body.renter
  });
  if (shopRentRequest)
    return res.status(400).send("You have Already submit shop Rent Request");
  const registeredProducts = await RegisteredProduct.find().select({
    shops: 1
  });
  //geting the owner of the shop
  for (const registeredProduct of registeredProducts) {
    for (const shop of registeredProduct.shops) {
      if (shopId == shop) {
        ownerId = registeredProduct._id;
      }
    }
  }
  shopRentRequest = new ShopBooking(
    _.pick(body, ["renter", "shop", "purpose", "startDate", "endDate"])
  );
  shopRentRequest.owner = ownerId;
  const result = await shopRentRequest.save();
  res.status(200).send(result);
});
router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;

  const shopBooking = await ShopBooking.findByIdAndUpdate(
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
  const result = await shopBooking.save();
  await Shop.findByIdAndUpdate({ _id: shopBooking.shop._id }, { onRent: true });
  res.status(200).send(result);
});
router.put("/approvedrentrequest/:id", async (req, res) => {
  const id = req.params.id;
  let request = await ShopBooking.findOne({ _id: id });
  if (!request)
    return res.status(404).send("ShopRentRequest with this id not Exist");
  request.status = "Approved";
  request.ApprovedDate = new Date().toLocaleDateString();
  request.ApprovedTime = new Date().toLocaleTimeString();
  const result = await request.save();
  res.status(200).send(result);
});
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  const result = await ShopBooking.findByIdAndDelete(_id);
  if (!result) return res.status(404).send("ShopBooking Given by Id not found");
  res.status(200).send(result);
});
module.exports = router;
