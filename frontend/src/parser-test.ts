import {
  type Expression,
  ExpressionStatement,
  Identifier,
  LetStatement,
  Program,
  IntegerLiteral,
  ReturnStatement,
  PrefixExpression,
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
    {input: "!5;", operator: "!", int: 5},
    {input: "-15", operator: "-", int: 15}
  ]

  for(const test of input){
    const l = new lexer(test.input)
    const p = new Parser(l)
    const prog = p.parseProgram()

    checkParserErrors(p)

    if(prog.statements.length != 1){
      console.error(`len(prog.statements) != 1, got ${prog.statements.length} instead.`)
    }

    if(!(prog.statements[0] instanceof ExpressionStatement)){
      console.log(`statement is not an ExpressionStatement, got ${typeof prog.statements[0]} instead.`)
    }

    if(!((prog.statements[0] as ExpressionStatement).expr instanceof PrefixExpression)){
      console.log(`statement is not an PrefixExpression, got ${typeof prog.statements[0]} instead.`)
    }

    const exp = (prog.statements[0] as ExpressionStatement).expr as PrefixExpression;

    if(exp.operator != test.operator){
      console.log(`exp.operator != \"${test.operator}\", got ${exp.operator} instead.`)
    }

    if(!testIntegerLiteral(exp.right, test.int)){
      console.error(`amogussy`)
    }
  }
}

function testIntegerLiteral(real: Expression, expected: number): boolean{
  if(!(real instanceof IntegerLiteral)){
    return false;
  }
  const ilit = real as IntegerLiteral;
  return ilit.val == expected
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
testIdentifierExpr();
testIntegerLiteralExpression();
