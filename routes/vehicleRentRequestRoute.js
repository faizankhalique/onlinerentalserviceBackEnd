const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {
  VehicleRentRequest,
  validateVehicleRentRequest
} = require("../models/vehicleRentRequest");
const { VehicleBooking } = require("../models/vehicleBooking");
const { RegisteredProduct } = require("../models/registeredProducts");
router.get("/", async (req, res) => {
  const vehicleRentRequests = await VehicleRentRequest.find()
    .populate("requester")
    .populate("vehicle")
    .populate("vehicleOwner");
  res.status(200).send(vehicleRentRequests);
});
router.get("/:id", async (req, res) => {
  const requester = req.params.id;
  const vehicleRentRequests = await VehicleRentRequest.find({
    requester: requester
  }).populate({ path: "vehicle" });
  res.status(200).send(vehicleRentRequests);
});
router.get("/approved", async (req, res) => {
  const approvedVehicleRentRequests = await VehicleRentRequest.find({
    status: "Approved"
  })
    .populate("requester")
    .populate("vehicle")
    .populate("vehicleOwner");
  res.status(200).send(approvedVehicleRentRequests);
});
router.post("/", async (req, res) => {
  const body = req.body; //request body
  const vehicleId = body.vehicle;
  let vehicleOwnerId = "";
  const { error } = validateVehicleRentRequest(body);
  if (error) return res.status(400).send(error.details[0].message);
  let vehicleRentRequest = await VehicleRentRequest.findOne({
    requester: body.requester
  });
  if (vehicleRentRequest)
    return res.status(400).send("You have Already submit Vehicle Rent Request");
  const registeredProducts = await RegisteredProduct.find().select({
    vehicles: 1
  });
  //geting the owner of the vehicle
  for (const registeredProduct of registeredProducts) {
    for (const vehicle of registeredProduct.vehicles) {
      if (vehicleId == vehicle) {
        console.log("vehicle", vehicle);
        vehicleOwnerId = registeredProduct._id;
        console.log("vehicleOwner", vehicleOwnerId);
      }
    }
  }
  vehicleRentRequest = new VehicleRentRequest(
    _.pick(body, [
      "requester",
      "vehicle",
      "duration",
      "purpose",
      "licenseNo",
      "startDate",
      "endDate"
    ])
  );
  vehicleRentRequest.vehicleOwner = vehicleOwnerId;
  const result = await vehicleRentRequest.save();
  res.status(200).send(result);
});
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  let request = await VehicleRentRequest.findOne({ _id: id });
  if (!request)
    return res.status(404).send("VehicleRentRequest with this id not Exist");
  request.status = "Approved";
  request.ApprovedDate = new Date().toLocaleDateString();
  request.ApprovedTime = new Date().toLocaleTimeString();
  const result = await request.save();
  // after approved request add request into booking
  let vehicleBooking = new VehicleBooking({
    renter: body.requester._id,
    owner: body.vehicleOwner._id,
    vehicle: body.vehicle._id,
    purpose: body.purpose,
    startDate: body.startDate,
    endDate: body.endDate
  });
  const result1 = await vehicleBooking.save();
  res.status(200).send(result1);
});
module.exports = router;
