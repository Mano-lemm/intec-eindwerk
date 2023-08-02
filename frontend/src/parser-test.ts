import { Identifier, LetStatement, Program } from "./ast";
import { lexer, TokenType } from "./lexer";
import { Parser } from "./parser";

function letTest() {
  let tests = [
    { input: "let x = 5;", expectedIdent: "x", expectedVal: 5 },
    { input: "let y = true;", expectedIdent: "y", expectedVal: true },
    { input: 'let foobar = "y";', expectedIdent: "foobar", expectedVal: "y" },
  ];

  for (let test of tests) {
    let l = new lexer(test.input);
    let p = new Parser(l);
    let program = p.parseProgram();

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
  let input = `return 5;
  return 10;
  return 993322;`;

  let l = new lexer(input);
  let p = new Parser(l);
  let prog = p.parseProgram();

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
  let prog = new Program();
  let letStmt = new LetStatement();
  letStmt.token = { token: TokenType.Let, literal: "let" };
  letStmt.name.token = { token: TokenType.Ident, literal: "myVar" };
  let ident = new Identifier();
  ident.token = { token: TokenType.Ident, literal: "anotherVar" };
  ident.val = "anotherVar";
  letStmt.val = ident;
  prog.statements = [letStmt];
}

function checkParserErrors(p: Parser) {
  if (p.errors.length != 0) {
    console.error(`parser has ${p.errors.length} errors:`);
    for (let err of p.errors) {
      console.error(`\t${err}`);
    }
    return true;
  }
  return false;
}

letTest();
returnTest();
