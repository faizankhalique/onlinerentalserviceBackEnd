const express = require("express");
const router = express.Router();
const _ = require("lodash");
const deletFile = require("../../utils/deleteFile");
const { Tool, validateTool } = require("../../models/tools/tool");
router.get("/", async (req, res) => {
  const tools = await Tool.find({ registered: true, onRent: false });

  res.status(200).send(tools);
});
router.get("/toolrequest", async (req, res) => {
  const toolRequests = await Tool.find().populate({ path: "requester" });
  res.status(200).send(toolRequests);
});
router.get("/ownertoolrequest/:id", async (req, res) => {
  const requester = req.params.id;
  const toolRequests = await Tool.find({ requester: requester });
  res.status(200).send(toolRequests);
});
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  const tool = await Tool.findById(_id);
  if (!tool) return res.status(404).send("Tool By Given Id Not found");
  res.status(200).send(tool);
});
router.post("/toolrequest", async (req, res) => {
  const body = req.body;
  const { error } = validateTool(body);
  if (error) return res.status(400).send(error.details[0].message);
  const toolRequest = new Tool(
    _.pick(body, [
      "requester",
      "toolName",
      "company",
      "description",
      "dailyRent",
      "memberShipDuration",
      "toolImages"
    ])
  );
  const result = await toolRequest.save();
  res.status(200).send(result);
});
router.put("/approvedtoolrequest/:id", async (req, res) => {
  const _id = req.params.id;
  const tool = await Tool.findById(_id);
  if (!tool) return res.status(404).send("tool Given by Id not found");
  tool.status = "Approved";
  tool.ApprovedDate = new Date().toLocaleDateString();
  tool.ApprovedTime = new Date().toLocaleTimeString();
  tool.registered = true;
  const result = await tool.save();
  res.status(200).send(result);
});
router.put("/updatetoolrequest/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  let tool = await tool.findById(_id);
  if (!tool) return res.status(404).send("tool Given by Id not found");
  if (JSON.stringify(tool.toolImages) != JSON.stringify(body.toolImages)) {
    for (const image of tool.toolImages) {
      let path =
        "F:/8th semester/FYP/Online Rental Service/router-app/public" +
        image.trim();
      deletFile(path);
    }
  }
  tool.requester = body.requester;
  tool.toolName = body.toolName;
  tool.company = body.company;
  tool.description = body.description;
  tool.dailyRent = body.dailyRent;
  tool.memberShipDuration = body.memberShipDuration;
  tool.toolImages = body.toolImages;
  const result = await tool.save();
  res.status(200).send(result);
});
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  const tool = await Tool.findById(_id);
  if (!tool) return res.status(404).send("tool Given by Id not found");
  for (const image of tool.toolImages) {
    let path =
      "F:/8th semester/FYP/Online Rental Service/router-app/public" +
      image.trim();
    deletFile(path);
  }
  const result = await Tool.findByIdAndDelete(_id);
  res.status(200).send(result);
});
module.exports = router;
