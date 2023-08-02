import {
  Identifier,
  LetStatement,
  Program,
  ReturnStatement,
  prefixParseFn,
  type Statement,
} from "./ast";
import { lex, type lexer, type token, TokenType } from "./lexer";

export class Parser {
  private lexer: lexer;
  public errors: string[] = [];
  private curToken: token;
  private peekToken: token;
  // add back in when actual pratt parsing
  // private prefixParseFns: Map<TokenType, prefixParseFn> = new Map([
  //   [[TokenType.Minus], () => {
  //     return new Identifier();
  //   }]
  // ])

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
    const program = new Program();

    while (this.curToken.token != TokenType.EOF) {
      const statement = this.parseStatement();
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
        return this.parseReturnStatement();
      default:
        return undefined;
    }
  }

  private parseLetStatement(): Statement | undefined {
    const statement = new LetStatement();
    statement.token = this.curToken;
    if (!this.expectPeek(TokenType.Ident)) {
      return undefined;
    }
    statement.name.token = this.curToken;
    statement.name.val = String(this.curToken.literal);

    if (!this.expectPeek(TokenType.Assign)) {
      return undefined;
    }

    // TODO: not skip expr
    while (!this.curTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }

    return statement;
  }

  private parseReturnStatement(): Statement | undefined {
    const statement = new ReturnStatement(this.curToken, undefined);

    this.nextToken();

    while (!this.curTokenIs(TokenType.Semicolon)) {
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
