const { TK_TYPES, TK_CONST_KEYS, TK_CONSTS } = require("./constants");
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

module.exports = tokenize;
