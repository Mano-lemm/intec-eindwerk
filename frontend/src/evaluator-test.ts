import { testEval, testIntegerObject } from "./test-helper.ts";

function testEvalIntegerExpression() {
  const tests: { input: string; expected: number }[] = [
    { input: "5", expected: 5 },
    { input: "10", expected: 10 },
  ];

  for (const test of tests) {
    const result = testEval(test.input);
    if (result == undefined) {
      console.error(`Expected object, got undefined instead.`);
      continue;
    }
    testIntegerObject(result, test.expected);
  }
}

testEvalIntegerExpression();
