import {
  BooleanLiteral,
  ExpressionStatement,
  IntegerLiteral,
  type Node,
  Program,
  type Statement,
  StringLiteral,
  PrefixExpression,
  InfixExpression,
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
  } else if (node instanceof InfixExpression) {
    const left = evaluate(node.left);
    if (left == undefined) {
      return undefined;
    }
    if (node.right == undefined) {
      return undefined;
    }
    const right = evaluate(node.right);
    if (right == undefined) {
      return undefined;
    }
    return evalInfixExpression(node.oper, left, right);
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

function evalInfixExpression(
  operator: string,
  left: mk_Object,
  right: mk_Object
): mk_Object {
  if (left.Type() == ObjectType.INTEGER && right.Type() == ObjectType.INTEGER) {
    return evalIntegerInfixExpression(operator, left, right);
  }
  // should only be entered by booleans or null
  // we can check for hard equality because we never allocate new booleans
  // so the objects will be the same ones in memory
  if (operator === "==") {
    return left === right ? TRUE : FALSE;
  } else if (operator !== "==") {
    return left !== right ? TRUE : FALSE;
  }
  return NULL;
}

function evalIntegerInfixExpression(
  operator: string,
  left: mk_Object,
  right: mk_Object
): mk_Object {
  const rightVal = (right as Integer_OBJ).val;
  const leftVal = (left as Integer_OBJ).val;
  switch (operator) {
    case "+":
      return new Integer_OBJ(leftVal + rightVal);
    case "-":
      return new Integer_OBJ(leftVal - rightVal);
    case "*":
      return new Integer_OBJ(leftVal * rightVal);
    case "/":
      return new Integer_OBJ(Math.floor(leftVal / rightVal));
    case "<":
      return leftVal < rightVal ? TRUE : FALSE;
    case ">":
      return leftVal > rightVal ? TRUE : FALSE;
    case "==":
      return leftVal == rightVal ? TRUE : FALSE;
    case "!=":
      return leftVal != rightVal ? TRUE : FALSE;
    default:
      return NULL;
  }
}
