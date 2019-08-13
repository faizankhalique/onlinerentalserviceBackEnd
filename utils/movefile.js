// <------------->
//moves the $file to $dir2
module.exports = function(file, dir2) {
  //include the fs, path modules
  let fs = require("fs");
  let path = require("path");

  //gets file name and adds it to dir2
  let f = path.basename(file);
  let dest = path.resolve(dir2, f);

  fs.rename(file, dest, err => {
    if (err) console.log("error", err.message);
    // else console.log("Successfully moved");
  });
};
// <---------------->
