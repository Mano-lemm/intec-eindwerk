import {
  BooleanLiteral,
  type Expression,
  Identifier,
  InfixExpression,
  IntegerLiteral,
} from "./ast.ts";
import { type Parser } from "./parser.ts";

export function testLiteral(
  real: Expression,
  expected: number | boolean | string
): boolean {
  if (typeof expected == "number") {
    return testIntegerLiteral(real, expected);
  } else if (typeof expected == "boolean") {
    return testBooleanLiteral(real, expected);
  } else {
    return testIdent(real, expected);
  }
}

function testIdent(real: Expression, expected: string): boolean {
  if (!(real instanceof Identifier)) {
    return false;
  }
  return real.tokenLiteral() === expected;
}

export function testBooleanLiteral(
  real: Expression,
  expected: boolean
): boolean {
  if (!(real instanceof BooleanLiteral)) {
    console.error(
      `real is not of type BooleanLiteral, got ${typeof real} instead.`
    );
    return false;
  }
  const ilit = real;
  if (ilit.val != expected) {
    console.error(
      `Expecting BooleanLiteral val: ${String(expected)}, got ${String(
        ilit.val
      )}`
    );
    return false;
  }
  return true;
}

export function testIntegerLiteral(
  real: Expression,
  expected: number
): boolean {
  if (!(real instanceof IntegerLiteral)) {
    console.error(
      `real is not of type IntegerLiteral, got ${typeof real} instead.`
    );
    return false;
  }
  const ilit = real;
  if (ilit.val != expected) {
    console.error(`Expecting IntegerLiteral val: ${expected}, got ${ilit.val}`);
    return false;
  }
  return true;
}

export function testInfixExpression(
  exp: Expression,
  left: string | number | boolean,
  oper: string,
  right: string | number | boolean
): boolean {
  if (!(exp instanceof InfixExpression)) {
    console.error(`Expecting InfixExpression, got ${typeof exp}`);
    return false;
  }

  if (!testLiteral(exp.left, left)) {
    return false;
  }

  if (exp.oper != oper) {
    return false;
  }

  if (exp.right == undefined) {
    return false;
  }

  if (!testLiteral(exp.right, right)) {
    return false;
  }
  return true;
}

export function checkParserErrors(p: Parser) {
  if (p.errors.length != 0) {
    console.error(`parser has ${p.errors.length} errors:`);
    for (const err of p.errors) {
      console.error(`\t${err}`);
    }
    return true;
  }
  return false;
}
