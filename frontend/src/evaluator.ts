import {
  BooleanLiteral,
  ExpressionStatement,
  IntegerLiteral,
  type Node,
  Program,
  type Statement,
  StringLiteral,
  PrefixExpression,
} from "./ast.ts";
import {
  Boolean_OBJ,
  Integer_OBJ,
  Null_OBJ,
  String_OBJ,
  type mk_Object,
} from "./object.ts";
import { ObjectType } from "./types.ts";

const TRUE = new Boolean_OBJ(true);
const FALSE = new Boolean_OBJ(false);
const NULL = new Null_OBJ();

export function evaluate(node: Node): mk_Object | undefined {
  if (node instanceof ExpressionStatement) {
    if (node.expr == undefined) {
      return undefined;
    }
    return evaluate(node.expr);
  } /* literal expressions */ else if (node instanceof IntegerLiteral) {
    return new Integer_OBJ(node.val);
  } else if (node instanceof BooleanLiteral) {
    return node.val ? TRUE : FALSE;
  } else if (node instanceof StringLiteral) {
    return new String_OBJ(node.val);
  } else if (node instanceof Program) {
    return evalStatements(node.statements);
  } else if (node instanceof PrefixExpression) {
    if (node.right == undefined) {
      return undefined;
    }
    const right = evaluate(node.right);
    if (right == undefined) {
      return undefined;
    }
    return evalPrefixExpression(node.operator, right);
  }
  return undefined;
  return undefined;
}

function evalStatements(stmts: Statement[]): mk_Object | undefined {
  let result: mk_Object | undefined;
  for (const statement of stmts) {
    result = evaluate(statement);
  }
  return result;
}

function evalPrefixExpression(
  oper: string,
  right: mk_Object
): mk_Object | undefined {
  switch (oper) {
    case "!":
      return evalBangOperatorExpression(right);
    case "-":
      return evalMinusPrefixOperatorExpression(right);
    default:
      return undefined;
  }
}

function evalBangOperatorExpression(right: mk_Object): mk_Object {
  switch (right) {
    case TRUE:
      return FALSE;
    case FALSE:
      return TRUE;
    case NULL:
      return TRUE;
    default:
      return FALSE;
  }
}

function evalMinusPrefixOperatorExpression(right: mk_Object): mk_Object {
  if (right.Type() != ObjectType.INTEGER) {
    return NULL;
  }
  const value = (right as Integer_OBJ).val;
  return new Integer_OBJ(-value);
}
