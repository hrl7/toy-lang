const { genConst } = require("./utils");
const TK_TYPES = genConst("TK", [
  "NUMBER",
  "OP_ADD",
  "OP_MUL",
  "LPAREN",
  "RPAREN",
  "EQ",
  "NEQ",
  "ASSIGN",
  "IDENT",
  "SEMI",
  "IF",
  "ELSE",
  "WHILE",
  "FOR",
  "LBRACKET",
  "RBRACKET",
  "INC",
  "DEC",
]);

const TK_CONSTS = {
  "*": TK_TYPES.OP_MUL,
  "+": TK_TYPES.OP_ADD,
  "(": TK_TYPES.LPAREN,
  ")": TK_TYPES.RPAREN,
  ";": TK_TYPES.SEMI,
  if: TK_TYPES.IF,
  else: TK_TYPES.ELSE,
  for: TK_TYPES.FOR,
  while: TK_TYPES.WHILE,
  "{": TK_TYPES.LBRACKET,
  "}": TK_TYPES.RBRACKET,
};
const TK_CONST_KEYS = Object.keys(TK_CONSTS);

const ND_TYPES = genConst("ND", [
  "NUMBER",
  "ADD",
  "MUL",
  "ASSIGN",
  "IDENT",
  "EQ",
  "NEQ",
  "IF",
  "WHILE",
  "FOR",
  "BLOCK",
  "DEC",
  "INC",
]);

const JS_TYPES = genConst("JS", [
  "NUMBER",
  "BOOLEAN",
  "STRING",
  "FUNCTION",
  "OBJECT",
  "UNDEFINED",
  "NULL",
]);
module.exports = {
  TK_TYPES: TK_TYPES,
  TK_CONSTS: TK_CONSTS,
  TK_CONST_KEYS: TK_CONST_KEYS,
  ND_TYPES: ND_TYPES,
  JS_TYPES: JS_TYPES,
};
