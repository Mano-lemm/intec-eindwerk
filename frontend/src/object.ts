import { BlockStatement, Identifier } from "./ast.ts";
import { ObjectType } from "./types.ts";

export interface mk_Object {
  Type(): ObjectType;
  Inspect(): string;
}

export class Integer_OBJ implements mk_Object {
  constructor(public val: number) {}
  Type(): ObjectType {
    return ObjectType.INTEGER;
  }
  Inspect(): string {
    return `${String(this.val)}`;
  }
}

export class Boolean_OBJ implements mk_Object {
  constructor(public val: boolean) {}
  Type(): ObjectType {
    return ObjectType.BOOLEAN;
  }
  Inspect(): string {
    return `${String(this.val)}`;
  }
}

export class String_OBJ implements mk_Object {
  constructor(public val: string) {}
  Type(): ObjectType {
    return ObjectType.STRING;
  }
  Inspect(): string {
    return `${this.val}`;
  }
}

export class Null_OBJ implements mk_Object {
  Type(): ObjectType {
    return ObjectType.NULL;
  }
  Inspect(): string {
    return "null";
  }
}

export class returnValue implements mk_Object {
  constructor(public value: mk_Object) {}
  Type(): ObjectType {
    return ObjectType.RETURN_VALUE;
  }
  Inspect(): string {
    return this.value.Inspect();
  }
}

export class error_OBJ implements mk_Object {
  constructor(public message: string) {}
  Type(): ObjectType {
    return ObjectType.ERROR;
  }
  Inspect(): string {
    return `ERROR: ${this.message}`;
  }
}

export class Function implements mk_Object {
  constructor(
    public params: Identifier[],
    public body: BlockStatement,
    public env: Environment
  ) {}
  Type(): ObjectType {
    return ObjectType.FUNCTION;
  }
  Inspect(): string {
    return `fn(${this.params
      .map((e) => {
        e.String();
      })
      .join(", ")}) {\n${this.body.String()}\n}`;
  }
}

export class Environment {
  constructor(public store: Map<string, mk_Object>, public outer: Environment | undefined) {}
  get(name: string): mk_Object | undefined {
    if(this.store.has(name)){
      return this.store.get(name);
    }
    return this.outer?.get(name)
  }
  set(name: string, val: mk_Object): mk_Object {
    this.store.set(name, val);
    return val;
  }
}

export const TRUE = new Boolean_OBJ(true);
export const FALSE = new Boolean_OBJ(false);
export const NULL = new Null_OBJ();
