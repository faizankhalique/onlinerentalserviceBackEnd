const express = require("express");
const router = express.Router();
const multer = require("multer");
const config = require("config");
const moveFile = require("../utils/movefile");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(
      null,
      // `F:/8th semester/FYP/Online Rental Service/router-app/public/images/userimages`
      `./public/userimages`
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
router.post("/", upload.single("file"), async (req, res, err) => {
  const userimage = `/images/userimages/${req.file.filename}`;
  // const dir2 = `F:/8th semester/FYP/Online Rental Service/router-app/public/images/userimages`;
  moveFile(
    `./public/userimages/${req.file.filename}`,
    config.get("userImagesPath")
  );
  res.status(200).send(userimage);
});

module.exports = router;
