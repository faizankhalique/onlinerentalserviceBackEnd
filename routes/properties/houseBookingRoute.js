const express = require("express");
const router = express.Router();
const _ = require("lodash");
const diff_months = require("../../utils/diff_months");
const getDays = require("../../utils/getDays");
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
  const renter = req.params.id;
  const houseRentRequests = await HouseBooking.find({
    renter: renter
  })
    .populate("renter")
    .populate("house")
    .populate("owner");
  res.status(200).send(houseRentRequests);
});
router.get("/housebookings", async (req, res) => {
  const houseRentRequests = await HouseBooking.find({ status: "Approved" })
    .populate("renter")
    .populate("house")
    .populate("owner");
  res.status(200).send(houseRentRequests);
});
router.get("/housebookings/:id", async (req, res) => {
  const renter = req.params.id;
  const houseRentRequests = await HouseBooking.find({
    renter: renter
    // bookingStatus: "Confirm"
  })
    .populate("renter")
    .populate("house")
    .populate("owner");
  res.status(200).send(houseRentRequests);
});
router.post("/houseRentRequest", async (req, res) => {
  const body = req.body; //request body
  const houseId = body.house;
  let ownerId = ""; //house owner
  const { error } = validateHouseBooking(body);
  if (error) return res.status(400).send(error.details[0].message);
  let houseRentRequest = await HouseBooking.findOne({
    renter: body.renter,
    house: body.house
  });
  if (houseRentRequest)
    return res
      .status(400)
      .send("You have Already submit Same House Rent Request");
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
  houseRentRequest.totalMonths = totalMonths;
  houseRentRequest.owner = ownerId;
  const result = await houseRentRequest.save();
  res.status(200).send(result);
});
router.put("/confirmbooking/:id", async (req, res) => {
  const _id = req.params.id;
  const houseBooking = await HouseBooking.findByIdAndUpdate(
    { _id: _id },
    {
      bookingDate: new Date().toLocaleDateString(),
      bookingStatus: "Confirm"
    }
  );
  await House.findByIdAndUpdate(
    { _id: houseBooking.house._id },
    { onRent: true }
  );
  const result = await houseBooking.save();
  res.status(200).send(result);
});
router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const houseBooking = await HouseBooking.findById(_id);
  (houseBooking.startDate = body.startDate),
    (houseBooking.endDate = body.endDate);
  (houseBooking.totalMonths = body.totalMonths),
    (houseBooking.security = body.security),
    houseBooking.payments.push({
      currentMonth: body.currentMonth,
      monthlyRent: body.monthlyRent,
      monthlyCommission: body.monthlyCommission,
      ownerMonthlyRent: body.ownerMonthlyRent,
      paidToOwnerDate: "",
      paidToOwnerStatus: false,
      paymentDate: new Date().toLocaleDateString()
    });
  if (body.bookingStatus == "Complete") {
    houseBooking.bookingStatus = body.bookingStatus;
    await House.findByIdAndUpdate(body.houseId, {
      onRent: false
    });
  }
  const result = await houseBooking.save();

  res.status(200).send(result);
});
router.put("/updatepayment/:id", async (req, res) => {
  const _id = req.params.id;
  const paymentId = req.body.paymentId;
  const houseBooking = await HouseBooking.findById(_id);
  for (const payment of houseBooking.payments) {
    if (paymentId == payment._id) {
      payment.paidToOwnerDate = new Date().toLocaleDateString();
      payment.paidToOwnerStatus = true;
    }
  }
  const result = await houseBooking.save();
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
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  const houseBooking = await HouseBooking.findById(_id).populate("house");
  res.status(200).send(houseBooking);
});
module.exports = router;
