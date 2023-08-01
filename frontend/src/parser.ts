import { Identifier, LetStatement, Program, Statement } from "./ast";
import { lex, lexer, token, TokenType } from "./lexer";

class Parser {
  private lexer: lexer;
  public errors: string[] = [];
  private curToken: token;
  private peekToken: token;

  constructor(l: lexer) {
    this.lexer = l;
    this.curToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();
  }

  private nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  public parseProgram(): Program {
    let program = new Program();

    while (this.curToken.token != TokenType.EOF) {
      let statement = this.parseStatement();
      if (statement != undefined) {
        program.statements.push(statement);
      }
      this.nextToken();
    }

    return program;
  }

  private parseStatement(): Statement | undefined {
    switch (this.curToken.token) {
      case TokenType.Let:
        return this.parseLetStatement();
      case TokenType.Return:
      default:
        return undefined;
    }
  }

  private parseLetStatement(): Statement | undefined {
    let statement = new LetStatement();
    statement.token = this.curToken;
    if (!this.expectPeek(TokenType.Ident)) {
      return undefined;
    }
    statement.name.token = this.curToken;
    statement.name.val = "" + this.curToken.literal;

    if (!this.expectPeek(TokenType.Assign)) {
      return undefined;
    }

    // TODO: not skip expr
    while (
      !this.curTokenIs(TokenType.Semicolon) &&
      !this.curTokenIs(TokenType.Illegal)
    ) {
      this.nextToken();
    }

    return statement;
  }

  private curTokenIs(t: TokenType): boolean {
    return this.curToken.token == t;
  }

  private peekTokenIs(t: TokenType): boolean {
    return this.peekToken.token == t;
  }

  private expectPeek(t: TokenType): boolean {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    }
    this.peekTypeError(t);
    return false;
  }

  private peekTypeError(t: TokenType) {
    this.errors.push(
      `Expecting token of type ${t}, got token of type ${this.peekToken.token}.`
    );
  }
}

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

    if (program.statements.length != 1) {
      console.error(
        `program doesn't contain 1 statement. len(prog)=${program.statements.length}`
      );
      return;
    }

    console.log(JSON.stringify(program.statements));
  }
}

letTest();
