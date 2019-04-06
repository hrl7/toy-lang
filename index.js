const tokenize = require("./src/tokenize");
const parse = require("./src/parse");
const evaluate = require("./src/evaluate");

const main = () => {
  const src = process.argv[2];
  console.log(`source : "${src}"`);
  if (src == null) {
    console.error("no source code found");
    process.exit(1);
  }

  const tokens = tokenize(src);
  console.log("Tokenized");
  console.log(tokens);
  console.log("-------");
  const nodes = parse(tokens);
  console.log("Parsed");
  console.log(JSON.stringify(nodes, null, 2));
  console.log("-------\nEval");
  console.log(`=> ${evaluate(nodes)}`);
};

main();
