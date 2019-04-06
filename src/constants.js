const { genConst } = require("./utils");
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

const ND_TYPES = genConst("ND", ["NUMBER", "ADD", "MUL"]);

module.exports = {
  TK_TYPES: TK_TYPES,
  TK_CONSTS: TK_CONSTS,
  TK_CONST_KEYS: TK_CONST_KEYS,
  ND_TYPES: ND_TYPES,
};
