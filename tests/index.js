const fs = require("fs");
const path = require("path");

function findTestScripts(dirname) {
  fs.readdirSync(dirname).map((file) => {
    const filename = path.join(dirname, file);
    if (fs.statSync(filename).isDirectory()) {
      findTestScripts(filename);
    } else if (filename.endsWith(".spec.ts")) {
      require(filename);
    }
  });
}

findTestScripts(__dirname);
