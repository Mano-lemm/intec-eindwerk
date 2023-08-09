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
  BlockStatement,
  IfExpression,
} from "./ast.ts";
import {
  FALSE,
  Integer_OBJ,
  NULL,
  String_OBJ,
  TRUE,
  type mk_Object,
} from "./object.ts";
import { ObjectType } from "./types.ts";

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
  } else if (node instanceof BlockStatement) {
    return evalStatements(node.statements);
  } else if (node instanceof IfExpression) {
    return evalIfExpression(node);
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

function evalIfExpression(node: IfExpression): mk_Object | undefined {
  const cond = evaluate(node.condition);
  if (cond == undefined) {
    return undefined;
  }
  if (isTruthy(cond)) {
    return evaluate(node.consequence);
  } else if (node.alternative != undefined) {
    return evaluate(node.alternative);
  }
  return NULL;
}

function isTruthy(obj: mk_Object): boolean {
  if (obj == NULL) {
    return false;
  } else if (obj == TRUE) {
    return true;
  } else if (obj == FALSE) {
    return false;
  }
  return true;
}
