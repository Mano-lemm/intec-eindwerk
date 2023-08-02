import { TokenType, keywords, type token } from "./types";

export class lexer {
  private input = "";
  private pos = 0;
  private readPos = 0;
  private ch = "";

  constructor(input: string) {
    this.input = input;
    this.readChar();
  }

  public nextToken(): token {
    let rt: token = { token: TokenType.Illegal, literal: "" };
    this.skipWhiteSpace();
    switch (this.ch) {
      case ",":
        rt = { token: TokenType.Comma, literal: "," };
        break;
      case ";":
        rt = { token: TokenType.Semicolon, literal: ";" };
        break;
      case ":":
        rt = { token: TokenType.Colon, literal: ":" };
        break;
      case "[":
        rt = { token: TokenType.LeftSquareBrace, literal: "[" };
        break;
      case "]":
        rt = { token: TokenType.RightSquareBrace, literal: "]" };
        break;
      case "(":
        rt = { token: TokenType.LeftRoundBrace, literal: "(" };
        break;
      case ")":
        rt = { token: TokenType.RightRoundBrace, literal: ")" };
        break;
      case "{":
        rt = { token: TokenType.LeftSquirlyBrace, literal: "{" };
        break;
      case "}":
        rt = { token: TokenType.RightSquirlyBrace, literal: "}" };
        break;
      case "=":
        if (this.peekChar() == "=") {
          rt = { token: TokenType.Equal, literal: "==" };
          this.readChar();
        } else {
          rt = { token: TokenType.Assign, literal: "=" };
        }
        break;
      case "+":
        rt = { token: TokenType.Plus, literal: "+" };
        break;
      case "-":
        rt = { token: TokenType.Minus, literal: "-" };
        break;
      case "!":
        if (this.peekChar() == "=") {
          rt = { token: TokenType.NotEqual, literal: "!=" };
          this.readChar();
        } else {
          rt = { token: TokenType.Bang, literal: "!" };
        }
        break;
      case "*":
        rt = { token: TokenType.Asterisk, literal: "*" };
        break;
      case "/":
        rt = { token: TokenType.Slash, literal: "/" };
        break;
      case "<":
        rt = { token: TokenType.LessThan, literal: "<" };
        break;
      case ">":
        rt = { token: TokenType.GreaterThan, literal: ">" };
        break;
      case "\0":
        rt = { token: TokenType.EOF, literal: "" };
        break;
      default:
        // match letter
        if (this.ch.match(/[a-z]/i) || this.ch.match(/_/)) {
          rt = this.readIdentifier();
        } else if (this.ch.match(/\d/)) {
          rt = this.readIntLiteral();
        } else if (this.ch.match(/"/)) {
          rt = this.readStringLiteral();
        } else {
          rt = { token: TokenType.Illegal, literal: "" };
        }
        return rt;
    }
    this.readChar();
    return rt;
  }
  readStringLiteral(): token {
    let literal = "";
    while (this.ch.match(/[a-z]/i) || this.ch.match(/_/)) {
      literal += this.ch;
      this.readChar();
    }
    if (!this.ch.match(/"/)) {
      console.error("excuse me wtf");
    } else {
      this.readChar();
    }
    return { token: TokenType.String, literal: literal };
  }

  private readIdentifier(): token {
    let literal = "";
    while (this.ch.match(/[a-z]/i) || this.ch.match(/_/)) {
      literal += this.ch;
      this.readChar();
    }
    let type = keywords[literal];
    if (type == undefined) {
      type = TokenType.Ident;
    }
    return { token: type, literal: literal };
  }

  private readIntLiteral(): token {
    let literal = "";
    while (this.ch.match(/\d/)) {
      literal += this.ch;
      this.readChar();
    }
    return { token: TokenType.Int, literal: parseInt(literal) };
  }

  private readChar() {
    if (this.pos >= this.input.length) {
      this.ch = "\0";
    } else {
      const xd = this.input[this.readPos];
      this.ch = xd ? xd : " ";
    }
    this.pos = this.readPos;
    this.readPos++;
  }

  private peekChar(): string {
    if (this.pos >= this.input.length) {
      return "\0";
    } else {
      let x = this.input[this.readPos];
      if (x == undefined) {
        x = "\0";
      }
      return x;
    }
  }

  private skipWhiteSpace() {
    while (this.ch.match(/\s/)) {
      this.readChar();
    }
  }
}

export function lex(input: string): token[] {
  const tokens: token[] = [];
  const parser = new lexer(input);
  let curTok = parser.nextToken();
  while (curTok.token != TokenType.EOF && curTok.token != TokenType.Illegal) {
    tokens.push(curTok);
    curTok = parser.nextToken();
  }
  tokens.push(curTok);
  return tokens;
}
