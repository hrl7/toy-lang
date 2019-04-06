const genConst = (prefix, consts) => {
  return consts.reduce((acc, c) => {
    return Object.assign(acc, { [c]: `${prefix}_${c}` });
  }, {});
};

module.exports.genConst = genConst;
