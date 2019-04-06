const run = require("./run");

tests = {
  "1+2*3": 7,
  "1*2+3": 5,
  "(1+2)*3": 9,
  "1*(2+3)": 5,
  "2*(2+3)": 10,
};

Object.keys(tests).forEach(t => {
  const expected = tests[t];
  test(`${t} => ${expected}`, () => {
    expect(run(t)).toBe(expected);
  });
});
