const express = require("express");
const router = express.Router();
const multer = require("multer");
const moveFile = require("../utils/movefile");
const config = require("config");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(
      null,
      // `F:/8th semester/FYP/Online Rental Service/router-app/public/images/productimages`
      "./public/productimages"
    );
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter: imageFileFilter });
router.post("/", upload.array("file"), async (req, res, err) => {
  // const dir2 =
  //   "F:/8th semester/FYP/Online Rental Service/router-app/public/images/productimages";
  let productImages = [];
  for (const file of req.files) {
    productImages.push(`/images/productimages/${file.filename}`);
    moveFile(
      `./public/productimages/${file.filename}`,
      config.get("productImagesPath")
    );
  }
  res.status(200).send(productImages);
});

module.exports = router;
