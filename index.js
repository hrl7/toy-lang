const genConst = (prefix, consts) => {
  return consts.reduce((acc, c) => {
    return Object.assign(acc, { [c]: `${prefix}_${c}` });
  }, {});
};

const TK_TYPES = genConst("TK", ["NUMBER", "OP_ADD", "OP_MUL"]);
const ND_TYPES = genConst("ND", ["NUMBER", "OP_ADD", "OP_MUL"]);

const tokenize = src => {
  const createNumber = n => ({ type: TK_TYPES.NUMBER, value: parseInt(n) });
  const mul = () => ({ type: TK_TYPES.OP_MUL });
  const add = () => ({ type: TK_TYPES.OP_ADD });

  let i = 0;
  const tokens = [];

  while (i < src.length) {
    const c = src[i];
    const charCode = src.charCodeAt(i);
    if (charCode >= 48 && charCode <= 57) {
      tokens.push(createNumber(c));
      i++;
      continue;
    }

    if (c === "*") {
      tokens.push(mul());
      i++;
      continue;
    }

    if (c === "+") {
      tokens.push(add());
      i++;
      continue;
    }

    console.error(`unexpected token ${c} ${charCode}`);
  }
  return tokens;
};

const parse = tks => {
  const nodes = [];
};

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
  console.log(nodes);
  console.log("-------");
};

main();
