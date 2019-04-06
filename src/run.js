const tokenize = require("./tokenize");
const parse = require("./parse");
const evaluate = require("./evaluate");

const run = (src, opts) => {
  opts = opts || {};
  if (src == null) {
    console.error("no source code found");
    process.exit(1);
  }

  if (opts.debug) {
    console.log(`source : "${src}"`);
    const tokens = tokenize(src);
    console.log("Tokenized");
    console.log(tokens);
    console.log("-------");
    const nodes = parse(tokens);
    console.log("Parsed");
    console.log(JSON.stringify(nodes, null, 2));
    console.log("-------\nEval");
    const result = evaluate(nodes);
    console.log(`=> ${result}`);
    return result;
  } else {
    const tokens = tokenize(src);
    const nodes = parse(tokens);
    const result = evaluate(nodes);
    return result;
  }
};

module.exports = run;
