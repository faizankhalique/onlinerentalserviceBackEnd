const express = require("express");
const router = express.Router();
const _ = require("lodash");
const diff_months = require("../../utils/diff_months");
const getDays = require("../../utils/getDays");
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
  const renter = req.params.id;
  const shopRentRequests = await ShopBooking.find({
    renter: renter
  })
    .populate("renter")
    .populate("shop")
    .populate("owner");
  res.status(200).send(shopRentRequests);
});
router.get("/shopbookings", async (req, res) => {
  const shopRentRequests = await ShopBooking.find({ status: "Approved" })
    .populate("renter")
    .populate("shop")
    .populate("owner");
  res.status(200).send(shopRentRequests);
});
router.get("/shopbookings/:id", async (req, res) => {
  const renter = req.params.id;
  const shopRentRequests = await ShopBooking.find({
    renter: renter
    // bookingStatus: "Confirm"
  })
    .populate("shop")
    .populate("renter")
    .populate("owner");
  res.status(200).send(shopRentRequests);
});
router.post("/shopRentRequest", async (req, res) => {
  const body = req.body; //request body
  const shopId = body.shop;
  let ownerId = ""; //shop owner
  const { error } = validateShopBooking(body);
  if (error) return res.status(400).send(error.details[0].message);
  let shopRentRequest = await ShopBooking.findOne({
    renter: body.renter,
    shop: body.shop
  });
  if (shopRentRequest)
    return res
      .status(400)
      .send("You have Already submit Same shop Rent Request");
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
  const startDate = new Date(body.startDate + ",00:00");
  const endDate = new Date(body.endDate + ".00:00");
  let totalMonths = diff_months(endDate, startDate);
  if (totalMonths == 0) {
    totalMonths = 1;
    const { firstDay, lastDay } = getDays(body.endDate);
    console.log(firstDay, lastDay);
    body.startDate = firstDay;
    body.endDate = lastDay;
  }
  shopRentRequest = new ShopBooking(
    _.pick(body, ["renter", "shop", "purpose", "startDate", "endDate"])
  );
  shopRentRequest.totalMonths = totalMonths;
  shopRentRequest.owner = ownerId;
  const result = await shopRentRequest.save();
  res.status(200).send(result);
});
router.put("/confirmbooking/:id", async (req, res) => {
  const _id = req.params.id;
  const shopBooking = await ShopBooking.findByIdAndUpdate(
    { _id: _id },
    {
      bookingDate: new Date().toLocaleDateString(),
      bookingStatus: "Confirm"
    }
  );
  const result = await shopBooking.save();
  await Shop.findByIdAndUpdate({ _id: shopBooking.shop._id }, { onRent: true });
  res.status(200).send(result);
});
router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const shopBooking = await ShopBooking.findById(_id);
  (shopBooking.startDate = body.startDate),
    (shopBooking.endDate = body.endDate);
  (shopBooking.totalMonths = body.totalMonths),
    (shopBooking.security = body.security),
    shopBooking.payments.push({
      currentMonth: body.currentMonth,
      monthlyRent: body.monthlyRent,
      monthlyCommission: body.monthlyCommission,
      ownerMonthlyRent: body.ownerMonthlyRent,
      paidToOwnerDate: "",
      paidToOwnerStatus: false,
      paymentDate: new Date().toLocaleDateString()
    });
  if (body.bookingStatus == "Complete") {
    console.log("complete");
    shopBooking.bookingStatus = body.bookingStatus;
    await Shop.findByIdAndUpdate(body.shopId, {
      onRent: false
    });
  }
  const result = await shopBooking.save();
  res.status(200).send(result);
});
router.put("/updatepayment/:id", async (req, res) => {
  const _id = req.params.id;
  const paymentId = req.body.paymentId;
  const shopBooking = await ShopBooking.findById(_id);
  for (const payment of shopBooking.payments) {
    if (paymentId == payment._id) {
      payment.paidToOwnerDate = new Date().toLocaleDateString();
      payment.paidToOwnerStatus = true;
    }
  }
  const result = await shopBooking.save();
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
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  const shopBooking = await ShopBooking.findById(_id).populate("shop");
  res.status(200).send(shopBooking);
});
module.exports = router;
