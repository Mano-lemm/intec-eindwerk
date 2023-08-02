import {
  type Expression,
  ExpressionStatement,
  Identifier,
  LetStatement,
  Program,
} from "./ast";
import { lexer } from "./lexer";
import { Parser } from "./parser";
import { TokenType } from "./types";

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

    // console.log(`parsed: ${JSON.stringify(program.statements)}`);
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

letTest();
returnTest();
testString();
