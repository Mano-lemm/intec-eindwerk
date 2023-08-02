import { token, TokenType } from "./lexer";

export interface Node {
  tokenLiteral(): string;
  String(): string;
}

export interface Statement extends Node {
  statement(): any;
}

export interface Expression extends Node {
  expression(): any;
}

export class Program {
  public statements: Statement[] = [];

  public toString(): string {
    let r = "";

    for (const stmt of this.statements) {
      r += stmt.String();
    }

    return r;
  }
}

export class LetStatement implements Statement {
  // constructor(public Token: token, public name: Identifier, public val: Expression) {}
  String(): string {
    return `${
      this.token.literal
    } ${this.name.String()} = ${this.val?.String()};`;
  }
  statement() {}
  tokenLiteral(): string {
    return "" + this.token.literal;
  }
  public token: token = { token: TokenType.Let, literal: "" };
  public name: Identifier = new Identifier();
  public val: Expression | undefined;
}

export class ReturnStatement implements Statement {
  constructor(public Token: token, public rval: Expression | undefined) {}
  String(): string {
    return `${this.Token.literal} ${this.rval?.String};`;
  }
  statement() {}
  tokenLiteral(): string {
    return "" + this.Token.literal;
  }
}

export class ExpressionStatement implements Expression {
  constructor(public Token: token, public expr: Expression | undefined) {}
  String(): string {
    return `${this.expr?.String()}`;
  }
  expression() {}
  tokenLiteral(): string {
    return "" + this.Token.literal;
  }
}

export class Identifier implements Statement {
  String(): string {
    return this.val;
  }
  statement() {}
  tokenLiteral(): string {
    return "" + this.token.literal;
  }
  public token: token = { token: TokenType.Ident, literal: "" };
  public val: string = "";
}
