const debug = require("debug")("parser");
const { TK_TYPES, ND_TYPES } = require("./constants");

/*
syntax

program: stmt

stmt: 'if' '(' cmp ')' stmt 
stmt: 'if' '(' cmp ')' stmt else  stmt 
stmt: block stmt
stmt: cmp ';' stmt
stmt: ''

blcok: '{' stmt '}'

cmp: add '==' add
cmp: add '!=' add
cmp: add 

add: assign '+' add
add: assign '.' term // IDENTIFIER
add: assign

assign: mul '=' add
assign: mul

mul: term '*' mul
mul: term

term: '(' add ')'
term: num
term: obj
term: IDENTIFIER '++'
term: IDENTIFIER '--'
term: IDENTIFIER

obj: { prop_def }

prop_def: IDENTIFIER ':' cmp ',' prop_def
prop_def: IDENTIFIER ':' cmp ',' 
prop_def: '[' cmp ']' ':' cmp ',' prop_def
prop_def: '[' cmp ']' ':' cmp ',' 
prop_def: IDENTIFIER ':' cmp
prop_def: e



num: [0-9]* 
num: -[0-9]* 

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

  const unexpectedTokenError = expected => {
    if (expected) {
      console.error(
        `expected ${expected}, got unexpected token ${JSON.stringify(tks[i])}`
      );
    } else {
      console.error(`got unexpected token ${JSON.stringify(tks[i])}`);
    }
    console.trace();
    throw new Error("got unexpected token");
  };

  const consumeAndAssert = tokenType => {
    if (!consume(tokenType)) unexpectedTokenError(tokenType);
  };

  const term = () => {
    debug(`term: tks[${i}]: ${tks[i].type}`);
    if (consume(TK_TYPES.LPAREN)) {
      const node = add();
      if (!consume(TK_TYPES.RPAREN)) unexpectedTokenError();
      return node;
    }
    let tk = tks[i];
    if (consume(TK_TYPES.NUMBER)) {
      debug("term: number found");
      return { type: ND_TYPES.NUMBER, value: tk.value };
    }
    if (consume(TK_TYPES.LBRACKET)) {
      tk = tks[i];
      const props = [];
      while (consume(TK_TYPES.IDENT)) {
        if (!consume(TK_TYPES.COLON)) unexpectedTokenError();
        props.push({ key: tk.value, value: cmp() });
        tk = tks[i];
        if (!consume(TK_TYPES.COMMA)) break;
      }
      if (!consume(TK_TYPES.RBRACKET)) unexpectedTokenError();
      return { type: ND_TYPES.OBJECT, props: props };
    }
    if (consume(TK_TYPES.IDENT)) {
      debug("term: ident found");
      const node = { type: ND_TYPES.IDENT, name: tk.value };
      if (consume(TK_TYPES.INC)) {
        return { type: ND_TYPES.INC, target: node };
      }
      if (consume(TK_TYPES.DEC)) {
        return { type: ND_TYPES.DEC, target: node };
      }
      return node;
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
    if (consume(TK_TYPES.DOT)) {
      const rhs = term();
      return { type: ND_TYPES.GET, right: rhs, left: lhs };
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
    if (consume(TK_TYPES.DOT)) {
      const tk = tks[i];
      if (!consume(TK_TYPES.IDENT)) unexpectedTokenError();
      return { type: ND_TYPES.GET, ref: tk.value };
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

  const stmt = () => {
    if (consume(TK_TYPES.IF)) {
      consumeAndAssert(TK_TYPES.LPAREN);
      const cond = cmp();
      consumeAndAssert(TK_TYPES.RPAREN);
      const first = stmt();
      let second;
      if (consume(TK_TYPES.ELSE)) {
        second = stmt();
      }
      return { type: ND_TYPES.IF, cond: cond, first: first, second: second };
    }

    if (consume(TK_TYPES.LBRACKET)) {
      const nodes = [];
      while (!consume(TK_TYPES.RBRACKET)) {
        nodes.push(stmt());
      }
      return { type: ND_TYPES.BLOCK, nodes: nodes };
    }

    const node = cmp();
    if (tks[i] == null) return node;
    consumeAndAssert(TK_TYPES.SEMI);
    return node;
  };

  const nodes = [];
  let i = 0;
  while (i < tks.length) {
    const tk = tks[i];
    const node = stmt();
    nodes.push(node);
    if (tks[i] == null) break;
  }
  return nodes;
};

module.exports = parse;
