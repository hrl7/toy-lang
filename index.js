const genConst = (prefix, consts) => {
  return consts.reduce((acc, c) => {
    return Object.assign(acc, { [c]: `${prefix}_${c}` });
  }, {});
};

const TK_TYPES = genConst("TK", [
  "NUMBER",
  "OP_ADD",
  "OP_MUL",
  "LPAREN",
  "RPAREN",
]);
const TK_CONSTS = {
  "*": TK_TYPES.OP_MUL,
  "+": TK_TYPES.OP_ADD,
  "(": TK_TYPES.LPAREN,
  ")": TK_TYPES.RPAREN,
};
const TK_CONST_KEYS = Object.keys(TK_CONSTS);

const tokenize = src => {
  const createNumber = n => ({ type: TK_TYPES.NUMBER, value: parseInt(n) });

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

    if (TK_CONST_KEYS.indexOf(c) !== -1) {
      tokens.push({ type: TK_CONSTS[c] });
      i++;
      continue;
    }

    console.error(`unexpected token ${c} ${charCode}`);
  }
  return tokens;
};

const ND_TYPES = genConst("ND", ["NUMBER", "ADD", "MUL"]);

const parse = tks => {
  const consume = tokenType => {
    if (tks[i] != null && tks[i].type === tokenType) {
      i++;
      return true;
    }
    return false;
  };

  const unexpectedTokenError = () => {
    console.error(`got unexpected token ${JSON.stringify(tks[i])}`);
    process.exit(1);
  };
  const num = () => {
    const tk = tks[i];
    console.log(`num: ${i}, ${tk.type}`);
    if (consume(TK_TYPES.NUMBER)) {
      return { type: ND_TYPES.NUMBER, value: tk.value };
    }
    unexpectedTokenError();
  };
  const term = () => {
    if (consume(TK_TYPES.LPAREN)) {
      const node = add();
      if (!consume(TK_TYPES.RPAREN)) unexpectedTokenError();
      return node;
    }
    return num();
  };
  const mul = () => {
    console.log(`mul: ${i}`);
    const lhs = term();
    if (lhs == null) unexpectedTokenError();
    if (consume(TK_TYPES.OP_MUL)) {
      const rhs = mul();
      if (rhs == null) unexpectedTokenError();
      return { type: ND_TYPES.MUL, right: rhs, left: lhs };
    }
    return lhs;
  };
  const add = () => {
    console.log(`add: ${i}`);
    const lhs = mul();
    if (lhs == null) unexpectedTokenError();
    if (consume(TK_TYPES.OP_ADD)) {
      const rhs = add();
      if (rhs == null) unexpectedTokenError();
      return { type: ND_TYPES.ADD, right: rhs, left: lhs };
    }
    return lhs;
  };
  const nodes = [];
  let i = 0;
  while (i < tks.length) {
    const tk = tks[i];
    const node = add();
    nodes.push(node);
    i++;
  }
  return nodes;
};

const evaluate = nodes => {
  const unexpectedNodeError = node => {
    console.error(`got unexpected node ${JSON.stringify(node)}`);
    process.exit(1);
  };
  const evalNode = node => {
    switch (node.type) {
      case ND_TYPES.NUMBER:
        return node.value;
      case ND_TYPES.ADD:
        return evalNode(node.left) + evalNode(node.right);
      case ND_TYPES.MUL:
        return evalNode(node.left) * evalNode(node.right);
      default:
        unexpectedNodeError(node);
    }
  };

  let i = 0,
    lastValue;
  while (i < nodes.length) {
    lastValue = evalNode(nodes[i]);
    i++;
  }
  return lastValue;
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
  console.log(JSON.stringify(nodes, null, 2));
  console.log("-------\nEval");
  console.log(`=> ${evaluate(nodes)}`);
};

main();
