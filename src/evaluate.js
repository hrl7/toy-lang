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
    throw new Error(`got unexpected node ${JSON.stringify(node)}`);
  };
  const referenceError = name => {
    throw new Error(`reference error: ${name} is not defined`);
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
      case ND_TYPES.OBJECT: {
        return JS_OBJ.objectObject(
          node.props.reduce(
            (acc, o) => ({ ...acc, [o.key]: evalNode(env, o.value) }),
            {}
          )
        );
      }
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
      case ND_TYPES.IF: {
        if (evalNode(env, node.cond) === JS_OBJ.TRUE) {
          return evalNode(env, node.first);
        } else if (node.second) {
          return evalNode(env, node.second);
        }
        return JS_OBJ.UNDEFINED;
      }
      case ND_TYPES.BLOCK: {
        let j = 0;
        while (j < node.nodes.length) {
          evalNode(env, node.nodes[j]);
          j++;
        }
        return JS_OBJ.UNDEFINED;
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
      case ND_TYPES.INC: {
        const ident = evalLValue(env, node.target);
        const value = get(env, ident);
        const prevVal = value.value;
        value.value++;
        return JS_OBJ.numberObject(prevVal);
      }
      case ND_TYPES.DEC: {
        const ident = evalLValue(env, node.target);
        const value = get(env, ident);
        const prevVal = value.value;
        value.value--;
        return JS_OBJ.numberObject(prevVal);
      }
      case ND_TYPES.GET: {
        const ident = evalLValue(env, node.left);
        const key = evalLValue(env, node.right);
        const obj = get(env, ident);
        return obj.props[key];
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
