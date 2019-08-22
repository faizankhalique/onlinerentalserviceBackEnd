const express = require("express");
const router = express.Router();
const _ = require("lodash");
const diff_days = require("../../utils/diff_days");
const { RegisteredProduct } = require("../../models/registeredProducts");
const {
  ToolBooking,
  validateToolBooking
} = require("../../models/tools/toolBooking");
const { Tool } = require("../../models/tools/tool");
router.get("/toolrentrequests", async (req, res) => {
  const toolRentRequests = await ToolBooking.find({ status: "Approved" })
    .populate("renter")
    .populate("tool")
    .populate("owner");
  res.status(200).send(toolRentRequests);
});
router.get("/toolrentrequest/:id", async (req, res) => {
  const toolRentRequests = await ToolBooking.find().populate("tool");
  res.status(200).send(toolRentRequests);
});
router.get("/toolbookings/:id", async (req, res) => {
  const renter = req.params.id;
  const toolRentRequests = await ToolBooking.find({ renter: renter }).populate(
    "tool"
  );
  res.status(200).send(toolRentRequests);
});
router.get("/toolbookings/:id", async (req, res) => {
  const renter = req.params.id;
  const toolRentRequests = await ToolBooking.find({
    renter: renter,
    bookingConfirmation: "Confirm"
  }).populate("tool");
  res.status(200).send(toolRentRequests);
});
router.post("/toolRentRequest", async (req, res) => {
  const body = req.body; //request body
  const toolId = body.tool;
  let ownerId = ""; //tool owner
  const { error } = validateToolBooking(body);
  if (error) return res.status(400).send(error.details[0].message);
  let toolRentRequest = await ToolBooking.findOne({
    renter: body.renter
  });
  if (toolRentRequest)
    return res.status(400).send("You have Already submit tool Rent Request");
  const registeredProducts = await RegisteredProduct.find().select({
    tools: 1
  });
  //geting the owner of the tool
  for (const registeredProduct of registeredProducts) {
    for (const tool of registeredProduct.tools) {
      if (toolId == tool) {
        ownerId = registeredProduct._id;
      }
    }
  }
  toolRentRequest = new ToolBooking(
    _.pick(body, ["renter", "tool", "purpose", "startDate", "endDate"])
  );
  const tool = await Tool.findById(body.tool);
  console.log(tool);
  const dailyRent = tool.dailyRent;
  const endDate = new Date(body.endDate + ",00:00");
  const startDate = new Date(body.startDate + ",00:00");
  const days = diff_days(endDate, startDate) + 1;
  const totalRent = days * dailyRent;
  const commission = parseInt(totalRent * 0.2);
  toolRentRequest.owner = ownerId;
  toolRentRequest.commission = commission;
  toolRentRequest.rent = totalRent;
  const result = await toolRentRequest.save();
  res.status(200).send(result);
});
router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;

  const toolBooking = await ToolBooking.findByIdAndUpdate(
    { _id: _id },
    {
      security: body.security,
      rent: body.rent,
      startDate: body.startDate,
      endDate: body.endDate,
      commission: body.commission,
      bookingDate: new Date().toLocaleDateString(),
      bookingConfirmation: "Confirm"
    }
  );

  const result = await toolBooking.save();
  await Tool.findByIdAndUpdate({ _id: toolBooking.tool._id }, { onRent: true });
  res.status(200).send(result);
});
router.put("/approvedrentrequest/:id", async (req, res) => {
  const id = req.params.id;
  let request = await ToolBooking.findOne({ _id: id });
  if (!request)
    return res.status(404).send("ToolRentRequest with this id not Exist");
  request.status = "Approved";
  request.ApprovedDate = new Date().toLocaleDateString();
  request.ApprovedTime = new Date().toLocaleTimeString();
  const result = await request.save();
  res.status(200).send(result);
});
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  const result = await ToolBooking.findByIdAndDelete(_id);
  if (!result) return res.status(404).send("ToolBooking Given by Id not found");
  res.status(200).send(result);
});
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  const toolBooking = await ToolBooking.findById(_id).populate("tool");
  res.status(200).send(toolBooking);
});
module.exports = router;
