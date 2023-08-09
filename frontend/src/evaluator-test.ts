import { type mk_Object } from "./object.ts";
import {
  testBooleanObject,
  testEval,
  testIntegerObject,
} from "./test-helper.ts";

function testEvalIntegerExpression() {
  const tests: { input: string; expected: number }[] = [
    { input: "5", expected: 5 },
    { input: "10", expected: 10 },
    { input: "-5", expected: -5 },
    { input: "-10", expected: -10 },
    { input: "5 + 5 + 5 + 5 - 10", expected: 10 },
    { input: "2 * 2 * 2 * 2 * 2", expected: 32 },
    { input: "-50 + 100 + -50", expected: 0 },
    { input: "5 * 2 + 10", expected: 20 },
    { input: "5 + 2 * 10", expected: 25 },
    { input: "20 + 2 * -10", expected: 0 },
    { input: "50 / 2 * 2 + 10", expected: 60 },
    { input: "2 * (5 + 10)", expected: 30 },
    { input: "3 * 3 * 3 + 10", expected: 37 },
    { input: "3 * (3 * 3) + 10", expected: 37 },
    { input: "(5 + 10 * 2 + 15 / 3) * 2 + -10", expected: 50 },
  ];

  for (const test of tests) {
    const result = testEval(test.input);
    if (result == undefined) {
      console.error(`\tExpected object, got undefined instead.`);
      continue;
    }
    testIntegerObject(result, test.expected);
  }
}

function testEvalBooleanExpression() {
  const tests: { input: string; expected: boolean }[] = [
    { input: "true", expected: true },
    { input: "false", expected: false },
    { input: "1 < 2", expected: true },
    { input: "1 > 2", expected: false },
    { input: "1 < 1", expected: false },
    { input: "1 > 1", expected: false },
    { input: "1 == 1", expected: true },
    { input: "1 != 1", expected: false },
    { input: "1 == 2", expected: false },
    { input: "1 != 2", expected: true },
  ];
  let result: mk_Object | undefined;
  for (const test of tests) {
    result = testEval(test.input);
    if (result == undefined) {
      console.error(`Expected object, got undefined instead.`);
      continue;
    }
    testBooleanObject(result, test.expected);
  }
}

function testBangOperator() {
  const tests: { input: string; expected: boolean }[] = [
    { input: "!true", expected: false },
    { input: "!false", expected: true },
    { input: "!5", expected: false },
    { input: "!0", expected: false },
    { input: "!!true", expected: true },
    { input: "!!5", expected: true },
  ];

  for (const test of tests) {
    const result = testEval(test.input);
    if (result == undefined) {
      console.error(`Expected object, got undefined instead.`);
      continue;
    }
    testBooleanObject(result, test.expected);
  }
}

testEvalIntegerExpression();
testEvalBooleanExpression();
testBangOperator();
