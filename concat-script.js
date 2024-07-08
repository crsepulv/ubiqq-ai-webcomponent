const fs = require("fs-extra");
const concat = require("concat");

build = async () => {
  const files = [
    "./dist/ubiqq-ai-webcomponent/polyfills.js",
    "./dist/ubiqq-ai-webcomponent/main.js",
  ];

  const cssFiles = ["./dist/ubiqq-ai-webcomponent/styles.css"];

  await fs.ensureDir("custom-elements");
  await concat(files, "custom-elements/ubiqq-ai-webcomponent.js");
  await concat(cssFiles, "custom-elements/ubiqq-ai-webcomponent.css");
};
build();
