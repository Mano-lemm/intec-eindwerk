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

function testEvalBooleanExpression() {
  const tests: { input: string; expected: boolean }[] = [
    { input: "true", expected: true },
    { input: "false", expected: false },
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
