const { ND_TYPES } = require("./constants");
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

module.exports = evaluate;
