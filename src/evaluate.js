const debug = require("debug")("eval");
const { ND_TYPES } = require("./constants");
const evaluate = nodes => {
  const createEnv = parentEnv => ({ parentEnv: parentEnv || null, table: {} });
  const put = (env, name, value) => (env.table[name] = value);
  const get = (env, name) => {
    let v = env.table[name];
    return v;
  };
  const unexpectedNodeError = node => {
    console.error(`got unexpected node ${JSON.stringify(node)}`);
    process.exit(1);
  };
  const referenceError = name => {
    console.error(`reference error: ${name} is not defined`);
    process.exit(1);
  };

  const evalLValue = (env, node) => {
    debug(`evalLeftVal: ${node.type}`);
    switch (node.type) {
      case ND_TYPES.IDENT:
        return node.name;
      default:
        unexpectedNodeError(node);
    }
  };
  const evalNode = (env, node) => {
    debug(`evalNode: ${node.type}`);
    switch (node.type) {
      case ND_TYPES.NUMBER:
        return node.value;
      case ND_TYPES.ADD:
        return evalNode(env, node.left) + evalNode(env, node.right);
      case ND_TYPES.MUL:
        return evalNode(env, node.left) * evalNode(env, node.right);
      case ND_TYPES.ASSIGN: {
        const ident = evalLValue(env, node.left);
        const value = evalNode(env, node.right);
        put(env, ident, value);
        return value;
      }
      case ND_TYPES.IDENT: {
        let value = get(env, node.name);
        if (value == null) {
          put(env, node.name, undefined);
          value = undefined;
        }
        return value;
      }
      default:
        unexpectedNodeError(node);
    }
  };

  let i = 0,
    lastValue;
  const env = {
    children: [],
    table: {},
  };

  while (i < nodes.length) {
    lastValue = evalNode(env, nodes[i]);
    i++;
  }
  return lastValue;
};

module.exports = evaluate;
