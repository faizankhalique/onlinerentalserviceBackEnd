const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {
  VehicleRentRequest,
  validateVehicleRentRequest
} = require("../models/vehicleRentRequest");
router.post("/", async (req, res) => {
  const body = req.body; //request body
  const { error } = validateVehicleRentRequest(body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);
  const vehicleRentRequest = new VehicleRentRequest(
    _.pick(body, [
      "requester",
      "duration",
      "purpose",
      "licenseNo",
      "startDate",
      "endDate"
    ])
  );
  const result = await vehicleRentRequest.save();
  console.log(result);
  res.status(200).send(result);
});
module.exports = router;
