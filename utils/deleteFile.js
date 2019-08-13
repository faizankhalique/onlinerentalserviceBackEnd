module.exports = function(path) {
  const fs = require("fs");
  fs.unlink(path, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("file Delete successfully");
    //file removed
  });
};
