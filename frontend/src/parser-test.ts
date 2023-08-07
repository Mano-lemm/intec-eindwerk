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
  IfExpression,
  FunctionLiteral,
} from "./ast.ts";
import { lexer } from "./lexer.ts";
import { Parser } from "./parser.ts";
import { TokenType } from "./types.ts";
import {
  checkParserErrors,
  testInfixExpression,
  testLiteral,
} from "./test-helper.ts";

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
  const input: { input: string; operator: string; expr: number | boolean }[] = [
    { input: "!5;", operator: "!", expr: 5 },
    { input: "-15", operator: "-", expr: 15 },
    { input: "!true;", operator: "!", expr: true },
    { input: "!false;", operator: "!", expr: false },
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

    testLiteral(exp.right, test.expr);
  }
}

function testParsingInfixExpressions() {
  const tests: (
    | {
        input: string;
        leftVal: number;
        op: string;
        rightVal: number;
      }
    | {
        input: string;
        leftVal: boolean;
        op: string;
        rightVal: boolean;
      }
  )[] = [
    { input: "5 + 5;", leftVal: 5, op: "+", rightVal: 5 },
    { input: "5 - 5;", leftVal: 5, op: "-", rightVal: 5 },
    { input: "5 * 5;", leftVal: 5, op: "*", rightVal: 5 },
    { input: "5 / 5;", leftVal: 5, op: "/", rightVal: 5 },
    { input: "5 > 5;", leftVal: 5, op: ">", rightVal: 5 },
    { input: "5 < 5;", leftVal: 5, op: "<", rightVal: 5 },
    { input: "5 == 5;", leftVal: 5, op: "==", rightVal: 5 },
    { input: "5 != 5;", leftVal: 5, op: "!=", rightVal: 5 },
    { input: "true == true", leftVal: true, op: "==", rightVal: true },
    { input: "true != false", leftVal: true, op: "!=", rightVal: false },
    { input: "false == false", leftVal: false, op: "==", rightVal: false },
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

    if (!testLiteral(exp.left, e.leftVal)) {
      return;
    }

    if (exp.oper != e.op) {
      console.error(`exp.operator != \"${e.op}\", got ${exp.oper} instead.`);
    }

    if (exp.right == undefined) {
      console.error("right is undefined");
      return;
    }

    testLiteral(exp.right, e.rightVal);
  });
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
    { input: "true", expected: "true" },
    { input: "false", expected: "false" },
    { input: "3 > 5 == false", expected: "((3 > 5) == false)" },
    { input: "3 < 5 == true", expected: "((3 < 5) == true)" },
    { input: "1 + (2 + 3) + 4", expected: "((1 + (2 + 3)) + 4)" },
    { input: "(5 + 5) * 2", expected: "((5 + 5) * 2)" },
    { input: "2 / (5 + 5)", expected: "(2 / (5 + 5))" },
    { input: "-(5 + 5)", expected: "(-(5 + 5))" },
    { input: "!(true == true)", expected: "(!(true == true))" },
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

function testIfExpressions() {
  const input = "if (x < y ) { x }";
  const l = new lexer(input);
  const p = new Parser(l);
  const prog = p.parseProgram();
  if (checkParserErrors(p)) {
    return;
  }

  if (prog.statements.length != 1) {
    console.error(
      `len(program.statements) != 1, got ${prog.statements.length} instead.`
    );
    return;
  }

  if (!(prog.statements[0] instanceof ExpressionStatement)) {
    console.error(
      `prog.statements[0] is not an ExpressionStatement, got ${typeof prog
        .statements[0]} instead.`
    );
    return;
  }

  const stmt = prog.statements[0];

  if (!(stmt.expr instanceof IfExpression)) {
    console.error(
      `stmt.expr is not of type IfExpression, got ${typeof stmt} instead.`
    );
    return;
  }

  const exp = stmt.expr;

  if (!testInfixExpression(exp.condition, "x", "<", "y")) {
    return;
  }

  if (exp.alternative != undefined) {
    console.error(
      `exp.alt was not nill, got ${JSON.stringify(exp.alternative)} instead.`
    );
    return;
  }
}

function testParsingIfElseExpression() {
  const input = "if (x < y) { x } else { y }";
  const l = new lexer(input);
  const p = new Parser(l);
  const prog = p.parseProgram();

  if (checkParserErrors(p)) {
    return;
  }

  if (prog.statements.length != 1) {
    console.error(
      `len(program.statements) != 1, got ${prog.statements.length} instead.`
    );
    return;
  }

  let stmt = prog.statements[0] as ExpressionStatement;

  if (!(stmt.expr instanceof IfExpression)) {
    console.error(
      `stmt.expr is not of type IfExpression, got ${typeof stmt} instead.`
    );
    return;
  }

  const exp = stmt.expr;

  if (!testInfixExpression(exp.condition, "x", "<", "y")) {
    return;
  }

  if (exp.alternative == undefined) {
    console.error(`exp.alternative is undefined`);
    return;
  }

  if (exp.alternative.statements.length != 1) {
    console.error(
      `alt.statements.len != 1, got ${exp.alternative.statement.length} instead.`
    );
    return;
  }

  if (!(exp.alternative.statements[0] instanceof ExpressionStatement)) {
    console.error(
      `alt.statements[0] is not of type ExpressionStatement, got ${typeof exp
        .alternative.statements[0]} instead.`
    );
    return;
  }

  stmt = exp.alternative.statements[0];

  if (!(stmt.expr instanceof Identifier)) {
    console.error(
      `alt.expr is not of type Identifier, got ${typeof stmt.expr} instead.`
    );
    return;
  }

  if (!testLiteral(stmt.expr, "y")) {
    console.error(
      `alt.expr.literal is not \"y\", got ${stmt.expr.token.literal} instead.`
    );
    return;
  }
}

function testFunctionLiteralParsing() {
  const input = "fn(x, y) { x + y; }";
  const l = new lexer(input);
  const p = new Parser(l);
  const prog = p.parseProgram();

  if (checkParserErrors(p)) {
    return;
  }

  if (prog.statements.length != 1) {
    console.error(
      `len(program.statements) != 1, got ${prog.statements.length} instead.`
    );
    return;
  }

  if (!(prog.statements[0] instanceof ExpressionStatement)) {
    console.error(
      `prog.statements[0] is not ExpressionStatement, got ${typeof prog
        .statements[0]} instead.`
    );
    return;
  }
  const statement = prog.statements[0];

  if (!(statement.expr instanceof FunctionLiteral)) {
    console.error(
      `prog.statements[0] is not ExpressionStatement, got ${typeof prog
        .statements[0]} instead.`
    );
    return;
  }
  const func = statement.expr;

  if (func.parameters.length != 2) {
    console.error(
      `func.parameters.length != 2, got ${func.parameters.length} instead.`
    );
    return;
  }
  testLiteral(func.parameters[0], "x");
  testLiteral(func.parameters[1], "y");

  if (func.body.statements.length != 1) {
    console.error(
      `func.body.statements.length != 1, got ${func.body.statements.length} instead.`
    );
    return;
  }

  if (!(func.body.statements[0] instanceof ExpressionStatement)) {
    console.error(
      `func.body.statements[0] is not ExpressionStatement, got ${typeof func
        .body.statements[0]} instead.`
    );
    return;
  }

  const bodyStmt = func.body.statements[0];
  if (bodyStmt.expr == undefined) {
    console.error(
      `bodyStmt.expr is not Expression, got ${typeof bodyStmt.expr} instead.`
    );
    return;
  }
  testInfixExpression(bodyStmt.expr, "x", "+", "y");
}

function testFunctionParameterParsing() {
  const tests: { input: string; expected: string[] }[] = [
    { input: "fn(){}", expected: [] },
    { input: "fn(x) {}", expected: ["x"] },
    { input: "fn(x, y, z) {}", expected: ["x", "y", "z"] },
  ];

  for (const test of tests) {
    const l = new lexer(test.input);
    const p = new Parser(l);
    const prog = p.parseProgram();
    if (checkParserErrors(p)) {
      continue;
    }

    if (!(prog.statements[0] instanceof ExpressionStatement)) {
      console.error(
        `Expected ExpressionStatement, got ${typeof prog.statements[0]} instead`
      );
      continue;
    }

    if (!(prog.statements[0].expr instanceof FunctionLiteral)) {
      console.error(
        `Expected FunctionLiteral, got ${typeof prog.statements[0]
          .expr} instead`
      );
      continue;
    }

    // lovely
    prog.statements[0].expr.parameters.forEach((ident, idx) => {
      testLiteral(ident, test.expected[idx]);
    });
  }
}

letTest();
returnTest();
testString();
testIdentifierExpr();
testIntegerLiteralExpression();
testParsingPrefixExpressions();
testParsingInfixExpressions();
testOperatorPrecendenceParsing();
testIfExpressions();
testParsingIfElseExpression();
testFunctionLiteralParsing();
testFunctionParameterParsing();
