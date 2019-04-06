const { TK_TYPES, ND_TYPES } = require("./constants");
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

module.exports = parse;
