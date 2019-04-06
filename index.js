const run = require("./src/run");

const main = () => {
  const src = process.argv[2];
  run(src, { debug: true });
};

main();
