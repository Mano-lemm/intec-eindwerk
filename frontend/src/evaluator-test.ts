import { Integer_OBJ, Null_OBJ, type mk_Object } from "./object.ts";
import {
  testBooleanObject,
  testEval,
  testIntegerObject,
  testNullObject,
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
    { input: "true == true", expected: true },
    { input: "false == false", expected: true },
    { input: "true == false", expected: false },
    { input: "true != false", expected: true },
    { input: "false != true", expected: true },
    { input: "(1 < 2) == true", expected: true },
    { input: "(1 < 2) == false", expected: false },
    { input: "(1 > 2) == true", expected: false },
    { input: "(1 > 2) == false", expected: true },
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

function testIfElseExpressions() {
  const tests: { input: string; expected: number | null }[] = [
    { input: "if (true) { 10 }", expected: 10 },
    { input: "if (false) { 10 }", expected: null },
    { input: "if (1) { 10 }", expected: 10 },
    { input: "if (1 < 2) { 10 }", expected: 10 },
    { input: "if (1 > 2) { 10 }", expected: null },
    { input: "if (1 > 2) { 10 } else { 20 }", expected: 20 },
    { input: "if (1 < 2) { 10 } else { 20 }", expected: 10 },
  ];

  for (const test of tests) {
    const result = testEval(test.input);
    if (result == undefined) {
      console.error(`Expecting result, got undefined instead.`);
      continue;
    } else if (result instanceof Null_OBJ) {
      testNullObject(result);
    } else if (result instanceof Integer_OBJ) {
      if (test.expected == null) {
        console.error(
          `Expecting Integer result, got ${String(test.expected)} instead.`
        );
        continue;
      }
      testIntegerObject(result, test.expected);
    }
  }
}

testEvalIntegerExpression();
testEvalBooleanExpression();
testBangOperator();
testIfElseExpressions();
