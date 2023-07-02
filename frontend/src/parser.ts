import { Identifier, LetStatement, Program, Statement } from "./ast";
import { TokenType, lexer, token } from "./lexer";

class Parser {
    private lexer: lexer;
    public errors: string[] = [];
    private curToken: token;
    private peekToken: token;

    constructor(l: lexer){
        this.lexer = l;
        this.curToken = this.lexer.nextToken()
        this.peekToken = this.lexer.nextToken()
    }

    private nextToken(){
        this.curToken = this.peekToken
        this.peekToken = this.lexer.nextToken()
    }

    public parseProgram(): Program {
        let program = new Program()
        
        while(this.curToken.token != TokenType.EOF){
            let statement = this.parseStatement()
            if(statement != undefined){
                program.statements.push(statement)
            }
            this.nextToken()
        }

        return program
    }

    private parseStatement(): Statement | undefined{
        switch(this.curToken.token){
            case TokenType.Let:
                return this.parseLetStatement()
            default:
                return undefined;
        }
    }

    private parseLetStatement(): Statement | undefined {
        let statement = new LetStatement()
        statement.name.token = this.curToken
        statement.name.val = "" + this.curToken.literal

        if(!this.expectPeek(TokenType.Assign)){
            this.errors.push(`Was expecting type ${TokenType.Assign} got ${this.peekToken.token}`)
            return undefined
        }

        return statement
    }

    private curTokenIs(t: TokenType): boolean{
        return this.curToken.token == t
    }

    private peekTokenIs(t: TokenType): boolean{
        return this.peekToken.token == t
    }
    
    private expectPeek(t: TokenType): boolean {
        if(this.peekTokenIs(t)){
            this.nextToken()
            return true
        }
        return false
    }
}