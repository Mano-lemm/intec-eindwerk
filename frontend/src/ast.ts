import { TokenType, token } from "./lexer";

export interface Node {
    tokenLiteral(): string
}

export interface Statement extends Node {
    statement(): any
}

export interface Expression extends Node {
    expression(): any
}

export class Program {
    public statements: Statement[] = []

    public tokenLiteral(): string {
        let x = this.statements[0]
        if(x == undefined){
            return ""
        }
        return x.tokenLiteral()
    }
}

export class LetStatement implements Statement {
    statement() {}
    tokenLiteral(): string {
        return "" + this.token.literal
    }
    public token: token = {token: TokenType.Let, literal: ""}
    public name: Identifier = new Identifier()
    public val: Expression | undefined
}

export class Identifier implements Expression {
    expression() {}
    tokenLiteral(): string {
        return "" + this.token.literal
    }
    public token: token = {token: TokenType.Ident, literal: ""}
    public val: string = ""
}