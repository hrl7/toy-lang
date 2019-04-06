const debug = require("debug")("parser");
const { TK_TYPES, ND_TYPES } = require("./constants");

/*
syntax

stmt: cmp ';' stmt
stmt: ''

cmp: add '==' add
cmp: add '!=' add
cmp: add

add: assign '+' add
add: assign

assign: mul '=' add
assign: mul

mul: term '*' mul
mul: term

term: '(' add ')'
term: [0-9]* //number
term: IDENTIFIER

*/
const parse = tks => {
  const consume = tokenType => {
    debug(`try consume: ${tokenType}, got tks[${i}]: ${tks[i] && tks[i].type}`);
    if (tks[i] != null && tks[i].type === tokenType) {
      i++;
      debug(`consumed: ${tokenType}, next tks[${i}]: ${tks[i] && tks[i].type}`);
      return true;
    }
    return false;
  };

  const unexpectedTokenError = () => {
    console.error(`got unexpected token ${JSON.stringify(tks[i])}`);
    console.trace();
    process.exit(1);
  };

  const term = () => {
    debug(`term: tks[${i}]: ${tks[i].type}`);
    if (consume(TK_TYPES.LPAREN)) {
      const node = add();
      if (!consume(TK_TYPES.RPAREN)) unexpectedTokenError();
      return node;
    }
    const tk = tks[i];
    if (consume(TK_TYPES.NUMBER)) {
      debug("term: number found");
      return { type: ND_TYPES.NUMBER, value: tk.value };
    }
    if (consume(TK_TYPES.IDENT)) {
      debug("term: ident found");
      return { type: ND_TYPES.IDENT, name: tk.value };
    }
    unexpectedTokenError();
  };
  const mul = () => {
    debug(`mul: tks[${i}]: ${tks[i].type}`);
    const lhs = term();
    if (lhs == null) unexpectedTokenError();
    if (consume(TK_TYPES.OP_MUL)) {
      const rhs = mul();
      if (rhs == null) unexpectedTokenError();
      return { type: ND_TYPES.MUL, right: rhs, left: lhs };
    }
    return lhs;
  };
  const assign = () => {
    const lhs = mul();
    if (consume(TK_TYPES.ASSIGN)) {
      const rhs = assign();
      return { type: ND_TYPES.ASSIGN, right: rhs, left: lhs };
    }
    return lhs;
  };
  const add = () => {
    debug(`add: tks[${i}]: ${tks[i].type}`);
    const lhs = assign();
    if (lhs == null) unexpectedTokenError();
    if (consume(TK_TYPES.OP_ADD)) {
      const rhs = add();
      if (rhs == null) unexpectedTokenError();
      return { type: ND_TYPES.ADD, right: rhs, left: lhs };
    }
    return lhs;
  };
  const cmp = () => {
    debug(`cmp: tks[${i}]: ${tks[i].type}`);
    const lhs = add();
    if (lhs == null) unexpectedTokenError();
    if (consume(TK_TYPES.EQ)) {
      const rhs = add();
      if (rhs == null) unexpectedTokenError();
      return { type: ND_TYPES.EQ, right: rhs, left: lhs };
    }
    if (consume(TK_TYPES.NEQ)) {
      const rhs = add();
      if (rhs == null) unexpectedTokenError();
      return { type: ND_TYPES.NEQ, right: rhs, left: lhs };
    }
    return lhs;
  };
  const nodes = [];
  let i = 0;
  while (i < tks.length) {
    const tk = tks[i];
    const node = cmp();
    nodes.push(node);
    if (tks[i] == null) break;
    if (!consume(TK_TYPES.SEMI)) unexpectedTokenError();
  }
  return nodes;
};

module.exports = parse;
