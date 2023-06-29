enum TokenType {
    //special
    Illegal = "Illegal",
    EOF = "EOF",

    // ident and literal
    Ident = "Ident",
    Int = "Int",
    String = "String",

    // operations
    Assign = "Assign",
    Plus = "Plus",
    Minus = "Minus",
    Bang = "Bang",
    Asterisk = "Asterisk",
    Slash = "Slash",
    LessThan = "LessThan",
    GreaterThan = "GreaterThan",
    Equal = "Equal",
    NotEqual = "NotEqual", 

    // semantic
    Comma = "Comma",
    Semicolon = "Semicolon",
    Colon = "Colon",
    
    // keywords
    Function = "Function",
    Let = "Let",
    True = "True",
    False = "False",
    If = "If",
    Else = "Else",
    Return = "Return",
    
    // braces
    LeftRoundBrace = "LeftRoundBrace",
    RightRoundBrace = "RightRoundBrace",
    LeftSquirlyBrace = "LeftSquirlyBrace",
    RightSquirlyBrace = "RightSquirlyBrace",
    LeftSquareBrace = "LeftSquareBrace",
    RightSquareBrace = "RightSquareBrace"
}

type token = { token: TokenType, literal: string | number}

const keywords: Record<string, TokenType> = {
    "fn": TokenType.Function,
    "let": TokenType.Let,
    "true": TokenType.True,
    "false": TokenType.False,
    "if": TokenType.If,
    "else": TokenType.Else,
    "return": TokenType.Return
}

class lexer {
    private input = "";
    private pos = 0;
    private readPos = 0;
    private ch = "";

    constructor(input: string) {
        this.input = input;
        this.readChar()
    }

    nextToken(): token {
        let rt: token = {token: TokenType.Illegal, literal: ""}
        this.skipWhiteSpace()
        switch(this.ch){
            case ",":
                rt = {token: TokenType.Comma, literal: ","}
                break;
            case ";":
                rt = {token: TokenType.Semicolon, literal: ";"}
                break;
            case ":":
                rt = {token: TokenType.Colon, literal: ":"}
                break;
            case "[":
                rt = {token: TokenType.LeftSquareBrace, literal: "["}
                break;
            case "]":
                rt = {token: TokenType.RightSquareBrace, literal: "]"}
                break;
            case "(":
                rt = {token: TokenType.LeftRoundBrace, literal: "("}
                break;
            case ")":
                rt = {token: TokenType.RightRoundBrace, literal: ")"}
                break;
            case "{":
                rt = {token: TokenType.LeftSquirlyBrace, literal: "{"}
                break;
            case "}":
                rt = {token: TokenType.RightSquirlyBrace, literal: "}"}
                break;
            case "=":
                if(this.peekChar() == "="){
                    rt = {token: TokenType.Equal, literal: "=="}
                    this.readChar()
                } else {
                    rt = {token: TokenType.Assign, literal: "="}
                }
                break;
            case "+":
                rt = {token: TokenType.Plus, literal: "+"}
                break;
            case "-":
                rt = {token: TokenType.Minus, literal: "-"}
                break;
            case "!":
                if(this.peekChar() == "="){
                    rt = {token: TokenType.NotEqual, literal: "!="}
                    this.readChar()
                } else {
                    rt = {token: TokenType.Bang, literal: "!"}
                }
                break;
            case "*":
                rt = {token: TokenType.Asterisk, literal: "*"}
                break;
            case "/":
                rt = {token: TokenType.Slash, literal: "/"}
                break;
            case "<":
                rt = {token: TokenType.LessThan, literal: "<"}
                break;
            case ">":
                rt = {token: TokenType.GreaterThan, literal: ">"}
                break;
            case "\0":
                rt = {token: TokenType.EOF, literal: ""}
                break;
            default:
                // match letter
                if(this.ch.match(/[a-z]/i) || this.ch.match(/_/)){
                    rt = this.readIdentifier();
                } else if(this.ch.match(/\d/)){
                    rt = this.readIntLiteral()
                } else {
                    rt = {token: TokenType.Illegal, literal: ""}
                }
                return rt
        }
        this.readChar()
        return rt;
    }

    readIdentifier(): token{
        let literal = ""
        while(this.ch.match(/[a-z]/i) || this.ch.match(/_/)){
            literal += this.ch
            this.readChar()
        }
        let type = keywords[literal]
        if(type == undefined){
            type = TokenType.String
        }
        return {token: type, literal: literal}
    }

    readIntLiteral(): token{
        let literal = ""
        while(this.ch.match(/\d/)){
            literal += this.ch
            this.readChar()
        }
        return {token: TokenType.Int, literal: parseInt(literal)}
    }

    readChar() {
        if(this.pos >= this.input.length){
            this.ch = "\0"
        } else {
            const xd = this.input[this.readPos]
            this.ch = xd ? xd : " "
        }
        this.pos = this.readPos
        this.readPos++
    }

    peekChar(): string {
        if(this.pos >= this.input.length){
            return "\0"
        } else {
            let x = this.input[this.readPos]
            if(x == undefined){
                x = "\0"
            }
            return x
        }
    }

    skipWhiteSpace(){
        while(this.ch.match(/\s/)){
            this.readChar()
        }
    }
}

function lex(input: string): token[]{
    let tokens: token[] = [];
    let parser = new lexer(input)
    let curTok = parser.nextToken()
    while(curTok.token != TokenType.EOF && curTok.token != TokenType.Illegal){
        tokens.push(curTok)
        curTok = parser.nextToken()
    }
    tokens.push(curTok)
    return tokens;
}