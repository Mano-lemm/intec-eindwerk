import {
  type Expression,
  ExpressionStatement,
  Identifier,
  LetStatement,
  Program,
  IntegerLiteral,
  ReturnStatement,
  PrefixExpression,
  InfixExpression,
} from "./ast.ts";
import { lexer } from "./lexer.ts";
import { Parser } from "./parser.ts";
import { TokenType } from "./types.ts";

function letTest() {
  const tests = [
    { input: "let x = 5;", expectedIdent: "x", expectedVal: 5 },
    { input: "let y = true;", expectedIdent: "y", expectedVal: true },
    { input: 'let foobar = "y";', expectedIdent: "foobar", expectedVal: "y" },
  ];

  for (const test of tests) {
    const l = new lexer(test.input);
    const p = new Parser(l);
    const program = p.parseProgram();

    if (checkParserErrors(p)) {
      continue;
    }

    if (program.statements.length != 1) {
      console.error(
        `program doesn't contain 1 statement. len(prog)=${program.statements.length}`
      );
    }
  }
}

function returnTest() {
  const input = `return 5;
  return 10;
  return 993322;`;

  const l = new lexer(input);
  const p = new Parser(l);
  const prog = p.parseProgram();

  if (checkParserErrors(p)) {
    return;
  }

  if (prog.statements.length != 3) {
    console.error(`Expecting 3 statements, got ${prog.statements.length}`);
    return;
  }
  for (const statement of prog.statements) {
    if (!(statement instanceof ReturnStatement)) {
      console.error(
        `statement is not a ReturnStatement, got ${typeof statement} instead.`
      );
      continue;
    }
    if (statement.tokenLiteral() != "return") {
      console.error(
        `statement.tokenLiteral() != \"return\", got ${statement.tokenLiteral()} instead.`
      );
    }
  }
}

function testString() {
  const prog = new Program();
  const letStmt = new LetStatement();
  letStmt.token = { type: TokenType.Let, literal: "let" };
  const ident1 = new Identifier();
  ident1.token = { type: TokenType.Ident, literal: "myVar" };
  ident1.val = "myVar";
  letStmt.name = ident1;
  const ident = new Identifier();
  ident.token = { type: TokenType.Ident, literal: "anotherVar" };
  ident.val = "anotherVar";
  letStmt.val = ident;
  prog.statements = [letStmt];

  if (prog.toString() != "let myVar = anotherVar;") {
    console.error(`prog.toString() wrong:
    expected: \"let myVar = antherVar;\"
    got     : \"${prog.toString()}\"`);
  }
}

function testIdentifierExpr() {
  const input = "foobar;";
  const l = new lexer(input);
  const p = new Parser(l);
  const prog = p.parseProgram();

  checkParserErrors(p);

  if (prog.statements.length != 1) {
    console.error(
      `program doesn't have 1 statement, got ${prog.statements.length} statements instead.`
    );
  }

  const stmt = prog.statements[0];
  if (!(stmt instanceof ExpressionStatement)) {
    console.error(
      `Statement is not an ExpressionStatement, got a ${typeof prog
        .statements[0]} instead.`
    );
  }

  const exp: Expression | undefined = (stmt as ExpressionStatement).expr;
  if (!(exp instanceof Identifier)) {
    console.error(`expression is not `);
  }

  const ident: Identifier = exp as Identifier;

  if (ident.val != "foobar") {
    console.error(`ident.val is not \"foobar\", got ${ident.val}`);
  }
  if (ident.tokenLiteral() != "foobar") {
    console.error(
      `ident.tokenLiteral() not\"foobar\", got ${ident.tokenLiteral()}`
    );
  }
}

function testIntegerLiteralExpression() {
  const input = "5;";
  const l = new lexer(input);
  const p = new Parser(l);
  const prog = p.parseProgram();

  checkParserErrors(p);

  if (prog.statements.length != 1) {
    console.error(
      `program doesn't have 1 statement, got ${prog.statements.length} statements instead.`
    );
  }

  const stmt = prog.statements[0];
  if (!(stmt instanceof ExpressionStatement)) {
    console.error(
      `Statement is not an ExpressionStatement, got a ${typeof prog
        .statements[0]} instead.`
    );
  }

  const exp: Expression | undefined = (stmt as ExpressionStatement).expr;
  if (!(exp instanceof IntegerLiteral)) {
    console.error(
      `expression is not an IntegerLiteral, got ${typeof exp} instead.`
    );
  }

  const ident: IntegerLiteral = exp as IntegerLiteral;

  if (ident.val != 5) {
    console.error(`ident.val is not 5, got ${ident.val}`);
  }
  if (ident.tokenLiteral() != "5") {
    console.error(
      `ident.tokenLiteral() not \"5\", got \"${ident.tokenLiteral()}\"`
    );
  }
}

function testParsingPrefixExpressions() {
  const input = [
    { input: "!5;", operator: "!", int: 5 },
    { input: "-15", operator: "-", int: 15 },
  ];

  for (const test of input) {
    const l = new lexer(test.input);
    const p = new Parser(l);
    const prog = p.parseProgram();

    checkParserErrors(p);

    if (prog.statements.length != 1) {
      console.error(
        `len(prog.statements) != 1, got ${prog.statements.length} instead.`
      );
      continue;
    }

    if (!(prog.statements[0] instanceof ExpressionStatement)) {
      console.error(
        `statement is not an ExpressionStatement, got ${typeof prog
          .statements[0]} instead.`
      );
      continue;
    }

    if (!(prog.statements[0].expr instanceof PrefixExpression)) {
      console.error(
        `statement is not an PrefixExpression, got ${typeof prog
          .statements[0]} instead.`
      );
      continue;
    }

    const exp = prog.statements[0].expr;

    if (exp.operator != test.operator) {
      console.error(
        `exp.operator != \"${test.operator}\", got ${exp.operator} instead.`
      );
    }

    if (exp.right == undefined) {
      console.error("xdddd");
      continue;
    }

    testIntegerLiteral(exp.right, test.int);
  }
}

function testParsingInfixExpressions() {
  const tests: {
    input: string;
    leftVal: number;
    op: string;
    rightVal: number;
  }[] = [
    { input: "5 + 5;", leftVal: 5, op: "+", rightVal: 5 },
    { input: "5 - 5;", leftVal: 5, op: "-", rightVal: 5 },
    { input: "5 * 5;", leftVal: 5, op: "*", rightVal: 5 },
    { input: "5 / 5;", leftVal: 5, op: "/", rightVal: 5 },
    { input: "5 > 5;", leftVal: 5, op: ">", rightVal: 5 },
    { input: "5 < 5;", leftVal: 5, op: "<", rightVal: 5 },
    { input: "5 == 5;", leftVal: 5, op: "==", rightVal: 5 },
    { input: "5 != 5;", leftVal: 5, op: "!=", rightVal: 5 },
  ];

  tests.forEach((e) => {
    const l = new lexer(e.input);
    const p = new Parser(l);
    const prog = p.parseProgram();

    checkParserErrors(p);

    if (prog.statements.length != 1) {
      console.error(
        `len(prog.statements) != 1, got ${prog.statements.length} instead.`
      );
      return;
    }

    if (!(prog.statements[0] instanceof ExpressionStatement)) {
      console.error(
        `statement is not an ExpressionStatement, got ${typeof prog
          .statements[0]} instead.`
      );
      return;
    }

    if (!(prog.statements[0].expr instanceof InfixExpression)) {
      console.error(
        `statement is not an InfixExpression, got ${typeof prog
          .statements[0]} instead.`
      );
      return;
    }

    const exp = prog.statements[0].expr;

    if (!testIntegerLiteral(exp.left, e.leftVal)) {
      return;
    }

    if (exp.oper != e.op) {
      console.error(`exp.operator != \"${e.op}\", got ${exp.oper} instead.`);
    }

    if (exp.right == undefined) {
      console.error("right is undefined");
      return;
    }

    testIntegerLiteral(exp.right, e.rightVal);
  });
}

function testIntegerLiteral(real: Expression, expected: number): boolean {
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

function checkParserErrors(p: Parser) {
  if (p.errors.length != 0) {
    console.error(`parser has ${p.errors.length} errors:`);
    for (const err of p.errors) {
      console.error(`\t${err}`);
    }
    return true;
  }
  return false;
}

function testOperatorPrecendenceParsing() {
  const tests: { input: string; expected: string }[] = [
    { input: "-a * b", expected: "((-a) * b)" },
    { input: "!-a", expected: "(!(-a))" },
    { input: "a + b + c", expected: "((a + b) + c)" },
    { input: "a + b - c", expected: "((a + b) - c)" },
    { input: "a * b * c", expected: "((a * b) * c)" },
    { input: "a * b / c", expected: "((a * b) / c)" },
    { input: "a + b / c", expected: "(a + (b / c))" },
    {
      input: "a + b * c + d / e - f",
      expected: "(((a + (b * c)) + (d / e)) - f)",
    },
    { input: "3 + 4; -5 * 5", expected: "(3 + 4)((-5) * 5)" },
    { input: "5 > 4 == 3 < 4", expected: "((5 > 4) == (3 < 4))" },
    { input: "5 < 4 != 3 > 4", expected: "((5 < 4) != (3 > 4))" },
    {
      input: "3 + 4 * 5 == 3 * 1 + 4 * 5",
      expected: "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))",
    },
    {
      input: "3 + 4 * 5 == 3 * 1 + 4 * 5",
      expected: "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))",
    },
  ];

  tests.forEach((test) => {
    const l = new lexer(test.input);
    const p = new Parser(l);
    const prog = p.parseProgram();

    checkParserErrors(p);

    if (prog.toString() != test.expected) {
      console.error(`${test.input} did not parse correctly`);
      console.error(`\texpected:${test.expected}`);
      console.error(`\treal    :${prog.toString()}`);
    }
  });
}

letTest();
returnTest();
testString();
testIdentifierExpr();
testIntegerLiteralExpression();
testParsingPrefixExpressions();
testParsingInfixExpressions();
testOperatorPrecendenceParsing();
