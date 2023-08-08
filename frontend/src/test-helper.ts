import {
  BooleanLiteral,
  type Expression,
  Identifier,
  InfixExpression,
  IntegerLiteral,
} from "./ast.ts";
import { evaluate } from "./evaluator.ts";
import { lexer } from "./lexer.ts";
import { Integer_OBJ, type mk_Object } from "./object.ts";
import { Parser } from "./parser.ts";

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

export function testEval(input: string) {
  const l = new lexer(input);
  const p = new Parser(l);
  const prog = p.parseProgram();

  return evaluate(prog);
}

export function testIntegerObject(obj: mk_Object, expected: number): boolean {
  if (!(obj instanceof Integer_OBJ)) {
    console.error(`Expecting Integer_OBJ, got ${typeof obj} instead.`);
    return false;
  }
  if (obj.val != expected) {
    console.error(
      `Object has wrong value. got ${obj.val} expected ${expected} instead.`
    );
    return false;
  }
  return true;
}
