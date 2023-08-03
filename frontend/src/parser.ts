import {
  Identifier,
  LetStatement,
  Program,
  ReturnStatement,
  type Statement,
  ExpressionStatement,
  type Expression,
  IntegerLiteral,
} from "./ast.ts";
import { type lexer } from "./lexer.ts";
import {
  TokenType,
  operationOrder,
  type prefixParseFn,
  type token,
} from "./types.ts";

export class Parser {
  private lexer: lexer;
  public errors: string[] = [];
  private curToken: token;
  private peekToken: token;
  private prefixParseFns: Map<TokenType, prefixParseFn> = new Map([
    [
      TokenType.Ident,
      () => {
        const ident = new Identifier();
        ident.token = this.curToken;
        ident.val = String(this.curToken.literal);
        return ident as Expression;
      },
    ],
    [
      TokenType.Int,
      () => {
        return new IntegerLiteral(
          this.curToken,
          typeof this.curToken.literal === "number"
            ? this.curToken.literal
            : this.curToken.literal.includes(".")
            ? parseFloat(this.curToken.literal)
            : parseInt(this.curToken.literal)
        ) as Expression;
      },
    ],
  ]);

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

    while (this.curToken.type != TokenType.EOF) {
      const statement = this.parseStatement();
      if (statement != undefined) {
        program.statements.push(statement);
      }
      this.nextToken();
    }

    return program;
  }

  private parseStatement(): Statement | undefined {
    switch (this.curToken.type) {
      case TokenType.Let:
        return this.parseLetStatement();
      case TokenType.Return:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
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

  private parseExpressionStatement(): ExpressionStatement | undefined {
    const stmt = new ExpressionStatement(
      this.curToken,
      this.parseExpression(operationOrder.LOWEST)
    );

    if (this.peekTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }

    return stmt;
  }

  private parseExpression(order: operationOrder): Expression | undefined {
    if (!this.prefixParseFns.has(this.curToken.type)) {
      return undefined;
    }
    return (this.prefixParseFns.get(this.curToken.type) as prefixParseFn)();
  }

  private curTokenIs(t: TokenType): boolean {
    return this.curToken.type == t;
  }

  private peekTokenIs(t: TokenType): boolean {
    return this.peekToken.type == t;
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
      `Expecting token of type ${t}, got token of type ${this.peekToken.type}.`
    );
  }
}
