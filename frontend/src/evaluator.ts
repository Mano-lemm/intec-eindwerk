import {
  BooleanLiteral,
  ExpressionStatement,
  IntegerLiteral,
  type Node,
  Program,
  type Statement,
  StringLiteral,
} from "./ast.ts";
import {
  Boolean_OBJ,
  Integer_OBJ,
  String_OBJ,
  type mk_Object,
} from "./object.ts";

export function evaluate(node: Node): mk_Object | undefined {
  if (node instanceof ExpressionStatement) {
    if (node.expr == undefined) {
      return undefined;
    }
    return evaluate(node.expr);
  } /* literal expressions */ else if (node instanceof IntegerLiteral) {
    return new Integer_OBJ(node.val);
  } else if (node instanceof BooleanLiteral) {
    return new Boolean_OBJ(node.val);
  } else if (node instanceof StringLiteral) {
    return new String_OBJ(node.val);
  } else if (node instanceof Program) {
    return evalStatements(node.statements);
  }
  return undefined;
}

function evalStatements(stmts: Statement[]): mk_Object | undefined {
  let result: mk_Object | undefined;
  for (const statement of stmts) {
    result = evaluate(statement);
  }
  return result;
}
