const fs = require("fs-extra");
const concat = require("concat");

build = async () => {
  const files = [
    "./dist/ubiqq-ai-components/polyfills.js",
    "./dist/ubiqq-ai-components/main.js",
  ];

  const cssFiles = ["./dist/ubiqq-ai-components/styles.css"];

  await fs.ensureDir("custom-elements");
  await concat(files, "custom-elements/ubiqq-ai-components.js");
  await concat(cssFiles, "custom-elements/ubiqq-ai-components.css");
};
build();
