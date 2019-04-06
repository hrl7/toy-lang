const { TK_TYPES, TK_CONST_KEYS, TK_CONSTS } = require("./constants");
const tokenize = src => {
  const createNumber = n => ({ type: TK_TYPES.NUMBER, value: parseInt(n) });
  const createIdent = name => ({ type: TK_TYPES.IDENT, value: name });
  const isNum = code => code >= 48 && code <= 57;
  const isIdent = code =>
    (code >= 97 && code <= 122) ||
    (code >= 65 && code <= 90) ||
    code == 95 ||
    code == 36 ||
    isNum();

  let i = 0;
  const tokens = [];

  while (i < src.length) {
    let c = src[i],
      charCode = src.charCodeAt(i);
    if (/\s/.test(c)) {
      i++;
      continue;
    }

    if (isIdent(charCode) && !isNum(charCode)) {
      let buf = "";
      while (isIdent(charCode)) {
        buf += c;
        i++;
        charCode = src.charCodeAt(i);
        c = src[i];
      }

      if (TK_CONST_KEYS.indexOf(buf) !== -1) {
        tokens.push({ type: TK_CONSTS[buf] });
      } else {
        tokens.push(createIdent(buf));
      }
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

    if (c === "=") {
      i++;
      if (src[i] === "=") {
        tokens.push({ type: TK_TYPES.EQ });
        i++;
        continue;
      }
      tokens.push({ type: TK_TYPES.ASSIGN });
      continue;
    }

    if (c === "!" && src[i + 1] === "=") {
      tokens.push({ type: TK_TYPES.NEQ });
      i += 2;
      continue;
    }

    if (c === "+" && src[i + 1] === "+") {
      tokens.push({ type: TK_TYPES.INC });
      i += 2;
      continue;
    }

    if (c === "-" && src[i + 1] === "-") {
      tokens.push({ type: TK_TYPES.DEC });
      i += 2;
      continue;
    }

    if (TK_CONST_KEYS.indexOf(c) !== -1) {
      tokens.push({ type: TK_CONSTS[c] });
      i++;
      continue;
    }

    console.error(`unexpected token '${c}', charCode: ${charCode}`);
    process.exit(1);
  }
  return tokens;
};

module.exports = tokenize;
