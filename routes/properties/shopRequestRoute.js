const express = require("express");
const _ = require("lodash");
const config = require("config");
const router = express.Router();
const deletFile = require("../../utils/deleteFile");
const { Shop, validateShop } = require("../../models/Properties/shop");
router.get("/shoprequest", async (req, res) => {
  const shopRequests = await Shop.find().populate({ path: "requester" });
  res.status(200).send(shopRequests);
});
router.get("/ownershoprequest/:id", async (req, res) => {
  const requester = req.params.id;
  const shopRequests = await Shop.find({ requester: requester });
  res.status(200).send(shopRequests);
});
router.get("/", async (req, res) => {
  const shops = await Shop.find({ registered: true, onRent: false });

  res.status(200).send(shops);
});
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  const shop = await Shop.findById(_id);
  if (!shop) return res.status(404).send("Shop By Given Id Not found");
  res.status(200).send(shop);
});
router.post("/shoprequest", async (req, res) => {
  const body = req.body;
  const { error } = validateShop(body);
  if (error) return res.status(400).send(error.details[0].message);
  const shopRequest = new Shop(
    _.pick(body, [
      "requester",
      "city",
      "location",
      "area",
      "monthlyRent",
      "memberShipDuration",
      "shopImages"
    ])
  );
  const result = await shopRequest.save();
  res.status(200).send(result);
});
router.put("/approvedshoprequest/:id", async (req, res) => {
  const _id = req.params.id;
  const shop = await Shop.findById(_id);
  if (!shop) return res.status(404).send("Shop Given by Id not found");
  shop.status = "Approved";
  shop.ApprovedDate = new Date().toLocaleDateString();
  shop.ApprovedTime = new Date().toLocaleTimeString();
  shop.registered = true;
  const result = await shop.save();
  res.status(200).send(result);
});
router.put("/updateshoprequest/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  let shop = await Shop.findById(_id);
  if (!shop) return res.status(404).send("Shop Given by Id not found");
  if (JSON.stringify(shop.shopImages) != JSON.stringify(body.shopImages)) {
    console.log("not equal");
    for (const image of shop.shopImages) {
      let path =
        "F:/8th semester/FYP/Online Rental Service/router-app/public" +
        image.trim();
      deletFile(path);
    }
  }
  shop.requester = body.requester;
  shop.city = body.city;
  shop.location = body.location;
  shop.area = body.area;
  shop.monthlyRent = body.monthlyRent;
  shop.memberShipDuration = body.memberShipDuration;
  shop.shopImages = body.shopImages;
  const result = await shop.save();
  res.status(200).send(result);
});
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  const shop = await Shop.findById(_id);
  if (!shop) return res.status(404).send("shop Given by Id not found");
  for (const image of shop.shopImages) {
    let path =
      "F:/8th semester/FYP/Online Rental Service/router-app/public" +
      image.trim();
    deletFile(path);
  }
  const result = await Shop.findByIdAndDelete(_id);
  res.status(200).send(result);
});
module.exports = router;
