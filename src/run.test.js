const run = require("./run");

tests = {
  "1+2*3": 7,
  "1*2+3": 5,
  "(1+2)*3": 9,
  "1*(2+3)": 5,
  "2*(2+3)": 10,
  "2 * (2 + 3)": 10,
  "2 * (    	2 + 3  	 )     ": 10,
  "123": 123,
  "1 + 10": 11,
  "a = 10": 10,
  "a = 10; a + 5": 15,
  "a = 10; a + 5; a + 6": 16,
  "a = 10; a * a": 100,
  "a = 10; a * (a + a)": 200,
  "a = 1; b = 2; c= 3; a + b + c": 6,
  "hogepyio = 3": 3,
  "Hoge_Piyo=2; Hoge_Piyo * 5": 10,
  "1 == 0": false,
  "1 == 1": true,
  "1 + 2 + 3 == 6 ": true,
  "1 != 1": false,
  "1 != 0": true,
  "1 + 2 != 0": true,
  "a = 0; b= 1; a == b": false,
  "a = 0; b= 1; a + b == b": true,
  "a = 0; if (1 == 0) { a = 1; } a;": 0,
  "a = 0; if (1 == 1) { a = 1; } a;": 1,
  "a = 0; if (a == 1) { a = 1; } a;": 0,
  "a = 1; if (a == 1) { a = 0; } a;": 0,
  "a = 0; if (1 == 0) { a = 1; } else { a = 10; } a;": 10,
  "a = 0; if (1 == 1) { a = 1; } else { a = 10; } a;": 1,
  "a = 0; if (1 == 1) a = 1; else a = 10;  a;": 1,
};

Object.keys(tests).forEach(t => {
  const expected = tests[t];
  test(`${t} => ${expected}`, () => {
    expect(run(t)).toBe(expected);
  });
});
