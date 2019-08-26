const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const deletFile = require("../utils/deleteFile");
const {
  VehicleRequest,
  validateVehicleRequest
} = require("../models/vehicleRequest");
const { Vehicle } = require("../models/vehicle");
const router = express.Router();
router.get("/", async (req, res) => {
  const vehiclesRequests = await VehicleRequest.find()
    .populate("requester")
    .select();
  res.status(200).send(vehiclesRequests);
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const valid = mongoose.Types.ObjectId.isValid(id);
  if (!valid) return res.status(400).send("Invalid VehicleRequest id");
  const vehicleRequest = await VehicleRequest.findOne({
    _id: id,
    status: "Pending"
  });
  if (!vehicleRequest)
    return res.status(404).send("VehicleRequest Not Exist with this id");
  res.status(200).send(vehicleRequest);
});
router.get("/ownerequests/:id", async (req, res) => {
  const ownerId = req.params.id;
  const valid = mongoose.Types.ObjectId.isValid(ownerId);
  if (!valid) return res.status(400).send("Invalid Prooduct_Owner id");
  const vehicleRequests = await VehicleRequest.find({
    requester: ownerId
  });
  if (!vehicleRequests)
    return res.status(404).send("You have Not Submit any Vehicle Request");
  res.status(200).send(vehicleRequests);
});
router.post("/", async (req, res) => {
  const body = req.body;
  const { error } = validateVehicleRequest(body);
  if (error) return res.status(400).send(error.details[0].message);
  let vehicle = await Vehicle.findOne({ vehicleNo: body.vehicleNo });
  if (vehicle) return res.status(400).send("vehicleNo Already Exist");
  let vehicleRequest = new VehicleRequest(
    _.pick(body, [
      "requester",
      "vehicleName",
      "vehicleModel",
      "vehicleNo",
      "vehicleCompany",
      "fuelType",
      "vehicleType",
      "vehicleColour",
      "seatCapacity",
      "vehicleImages",
      "vehicleRent",
      "memberShipDuration"
    ])
  );
  const result = await vehicleRequest.save();
  res.status(200).send(result);
});

router.put("/updatevehiclerequest/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  let vehicleRequest = await VehicleRequest.findById(_id);
  if (!vehicleRequest)
    return res.status(404).send("vehicle Given by Id not found");
  if (
    JSON.stringify(vehicleRequest.vehicleImages) !=
    JSON.stringify(body.vehicleImages)
  ) {
    for (const image of vehicleRequest.vehicleImages) {
      let path =
        "F:/8th semester/FYP/Online Rental Service/router-app/public" +
        image.trim();
      deletFile(path);
    }
  }
  vehicleRequest.requester = body.requester;
  vehicleRequest.vehicleName = body.vehicleName;
  vehicleRequest.vehicleModel = body.vehicleModel;
  vehicleRequest.vehicleNo = body.vehicleNo;
  vehicleRequest.vehicleCompany = body.vehicleCompany;
  vehicleRequest.fuelType = body.fuelType;
  vehicleRequest.vehicleType = body.vehicleType;
  vehicleRequest.vehicleColour = body.vehicleColour;
  vehicleRequest.seatCapacity = body.seatCapacity;
  vehicleRequest.vehicleImages = body.vehicleImages;
  vehicleRequest.vehicleRent = body.vehicleRent;
  vehicleRequest.memberShipDuration = body.memberShipDuration;
  vehicleRequest.vehicleImages = body.vehicleImages;

  const result = await vehicleRequest.save();
  res.status(200).send(result);
});
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  let request = await VehicleRequest.findOne({ _id: id });
  if (!request)
    return res.status(404).send("VehicleRequest with this id not Exist");
  request.status = "Approved";
  request.ApprovedDate = new Date().toLocaleString();
  request.ApprovedTime = new Date().toLocaleTimeString();
  const result = await request.save();
  res.status(200).send(result);
});
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;

  const vehicle = await VehicleRequest.findById(_id);
  if (!vehicle) return res.status(404).send("Vehicle Given by Id not found");
  for (const image of vehicle.vehicleImages) {
    let path =
      "F:/8th semester/FYP/Online Rental Service/router-app/public" +
      image.trim();
    deletFile(path);
  }
  const result = await VehicleRequest.findByIdAndDelete(_id);
  res.status(200).send(result);
});
module.exports = router;
