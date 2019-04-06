const debug = require("debug")("eval");
const { ND_TYPES, JS_TYPES } = require("./constants");
const JS_OBJ = require("./object");
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
        return JS_OBJ.numberObject(node.value);
      case ND_TYPES.ADD:
        return JS_OBJ.numberObject(
          evalNode(env, node.left).value + evalNode(env, node.right).value
        );
      case ND_TYPES.MUL:
        return JS_OBJ.numberObject(
          evalNode(env, node.left).value * evalNode(env, node.right).value
        );
      case ND_TYPES.EQ: {
        // https://tc39.github.io/ecma262/#sec-abstract-equality-comparison
        const left = evalNode(env, node.left);
        const right = evalNode(env, node.right);
        if (left.type === right.type && left.value === right.value) {
          return JS_OBJ.TRUE;
        }
        return JS_OBJ.FALSE;
      }
      case ND_TYPES.NEQ: {
        // https://tc39.github.io/ecma262/#sec-abstract-equality-comparison
        const left = evalNode(env, node.left);
        const right = evalNode(env, node.right);
        if (left.type === right.type && left.value === right.value) {
          return JS_OBJ.FALSE;
        }
        return JS_OBJ.TRUE;
      }
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
