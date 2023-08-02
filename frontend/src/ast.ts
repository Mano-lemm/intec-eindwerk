import { TokenType, type token } from "./types";

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
    return `${this.token.literal} ${this.name.String()} = ${
      this.val !== undefined ? this.val.String() : ""
    };`;
  }
  statement() {}
  tokenLiteral(): string {
    return String(this.token.literal);
  }
  public token: token = { type: TokenType.Let, literal: "" };
  public name: Identifier = new Identifier();
  public val: Expression | undefined;
}

export class ReturnStatement implements Statement {
  constructor(public Token: token, public rval: Expression | undefined) {}
  String(): string {
    return `${this.Token.literal} ${
      this.rval !== undefined ? this.rval.String() : ""
    };`;
  }
  statement() {}
  tokenLiteral(): string {
    return String(this.Token.literal);
  }
}

export class ExpressionStatement implements Statement {
  constructor(public Token: token, public expr: Expression | undefined) {}
  String(): string {
    return `${this.expr !== undefined ? this.expr.String() : ""}`;
  }
  statement() {}
  tokenLiteral(): string {
    return String(this.Token.literal);
  }
}

export class Identifier implements Expression {
  String(): string {
    return this.val;
  }
  expression() {}
  tokenLiteral(): string {
    return String(this.token.literal);
  }
  public token: token = { type: TokenType.Ident, literal: "" };
  public val = "";
}

export class IntegerLiteral implements Expression {
  constructor(public token: token, public val: number) {}
  expression() {}
  tokenLiteral(): string {
    return String(this.token.literal);
  }
  String(): string {
    return this.tokenLiteral();
  }
}
