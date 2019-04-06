const { JS_TYPES } = require("./constants");

const NULL = {
  type: JS_TYPES.NULL,
};

const UNDEFINED = {
  type: JS_TYPES.UNDEFINED,
};

const booleanObject = v => ({
  type: JS_TYPES.BOOLEAN,
  value: v,
});

const TRUE = booleanObject(true);
const FALSE = booleanObject(false);

const numberObject = v => ({
  type: JS_TYPES.NUMBER,
  value: v,
});

const stringObeject = v => ({
  type: JS_TYPES.STRING,
  value: v,
});

const objectObject = props => ({
  type: JS_TYPES.OBJECT,
  props: props,
});

const display = obj => {
  switch (obj.type) {
    case JS_TYPES.NULL:
      return "null";
    case JS_TYPES.UNDEFINED:
      return "undefined";
    case JS_TYPES.NUMBER:
    case JS_TYPES.STRING:
      return obj.value;
    case JS_TYPES.BOOLEAN:
      return obj.value ? "true" : "false";
    case JS_TYPES.OBJECT:
      return `{${Object.keys(obj.props).reduce(
        (acc, k) => `${k}: ${display(obj.props[k])}`,
        ""
      )}}`;
    default:
      console.error(`unexpected object ${JSON.stringify(obj)}`);
      process.exit(1);
  }
};

module.exports = {
  NULL,
  UNDEFINED,
  TRUE,
  FALSE,
  booleanObject,
  numberObject,
  stringObeject,
  objectObject,
  display,
};
