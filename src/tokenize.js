const { TK_TYPES, TK_CONST_KEYS, TK_CONSTS } = require("./constants");
const tokenize = src => {
  const createNumber = n => ({ type: TK_TYPES.NUMBER, value: parseInt(n) });
  const isNum = code => code >= 48 && code <= 57;

  let i = 0;
  const tokens = [];

  while (i < src.length) {
    let c = src[i],
      charCode = src.charCodeAt(i);
    if (/\s/.test(c)) {
      i++;
      continue;
    }

    if (isNum(charCode)) {
      let buf = "";
      while (isNum(charCode)) {
        buf += c;
        i++;
        charCode = src.charCodeAt(i);
        c = src[i];
      }

      tokens.push(createNumber(buf));
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
