
enum TokenType {
    //special
    Illegal,
    EOF,

    // ident and literal
    Ident,
    Int,
    String,

    // operations
    Assign,
    Plus,
    Minus,
    Bang,
    Asterisk,
    Slash,
    LessThan,
    GreaterThan,
    Equal,
    NotEqual, 

    // semantic
    Comma,
    Semicolon,
    Colon,
    
    // keywords
    Function,
    Let,
    True,
    False,
    If,
    Else,
    Return,
    
    // braces
    LeftRoundBrace,
    RightRoundBrace,
    LeftSquirlyBrace,
    RightSquirlyBrace,
    LeftSquareBrace,
    RightSquareBrace
}

type token = { token: TokenType, literal: string | number}

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
            case ";":
                rt = {token: TokenType.Semicolon, literal: ";"}
            case ":":
                rt = {token: TokenType.Colon, literal: ":"}
            case "[":
                rt = {token: TokenType.LeftSquareBrace, literal: "["}
            case "]":
                rt = {token: TokenType.RightSquareBrace, literal: "]"}
            case "(":
                rt = {token: TokenType.LeftRoundBrace, literal: "("}
            case ")":
                rt = {token: TokenType.RightRoundBrace, literal: ")"}
            case "{":
                rt = {token: TokenType.LeftSquirlyBrace, literal: "{"}
            case "}":
                rt = {token: TokenType.RightSquirlyBrace, literal: "}"}
            case "=":
                rt = {token: TokenType.Assign, literal: "="}
            case "+":
                rt = {token: TokenType.Plus, literal: "+"}
            case "-":
                rt = {token: TokenType.Minus, literal: "-"}
            case "!":
                rt = {token: TokenType.Bang, literal: "!"}
            case "*":
                rt = {token: TokenType.Asterisk, literal: "*"}
            case "/":
                rt = {token: TokenType.Slash, literal: "/"}
            case "<":
                rt = {token: TokenType.LessThan, literal: "<"}
            case ">":
                rt = {token: TokenType.GreaterThan, literal: ">"}
            case "\0":
                rt = {token: TokenType.EOF, literal: ""}
            default:
                // match letter
                if(this.ch.match(/[a-z]/i || this.ch.match(/_/))){
                    rt = this.readIdentifier();
                } else if(this.ch.match(/\d/)){
                    rt = this.readIntLiteral()
                } else {
                    rt = {token: TokenType.Illegal, literal: ""}
                }
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
        return {token: TokenType.Illegal, literal: ""}
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
    while(curTok.token != TokenType.EOF){
        tokens.push(curTok)
    }
    return tokens;
}

console.log(lex(`let five = 5;
let ten = 10;

let add = fn(x, y){
    x + y;
};

let result = add(five, ten);
!-/*5;

5 < 10 > 5;

if (5 < 10) {
    return true;
} else {
    return false;
}`))