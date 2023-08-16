import { type BlockStatement, type Identifier } from "./ast.ts";
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

export class mk_Function implements mk_Object {
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
  constructor(
    public store: Map<string, mk_Object>,
    public outer: Environment | undefined
  ) {}
  get(name: string): mk_Object | undefined {
    if (this.store.has(name)) {
      return this.store.get(name);
    }
    return this.outer?.get(name);
  }
  set(name: string, val: mk_Object): mk_Object {
    this.store.set(name, val);
    return val;
  }
}

export class Builtin implements mk_Object {
  constructor(public fn: (obj: mk_Object[]) => mk_Object) {}
  Type(): ObjectType {
    return ObjectType.BUILTIN;
  }
  Inspect(): string {
    return "builtin function";
  }
}

export class Array_OBJ implements mk_Object {
  constructor(public elements: mk_Object[]) {}
  Type(): ObjectType {
    return ObjectType.ARRAY;
  }
  Inspect(): string {
    return `[${this.elements.map((e) => e.Inspect()).join(", ")}]`;
  }
}

export const TRUE = new Boolean_OBJ(true);
export const FALSE = new Boolean_OBJ(false);
export const NULL = new Null_OBJ();
export const builtins: Map<string, Builtin> = new Map<string, Builtin>([
  [
    "len",
    new Builtin((str: mk_Object[]) => {
      if (str.length != 1) {
        return new error_OBJ(
          `wrong number of arguments. got=${str.length}, want=1`
        );
      }
      if (!(str[0] instanceof String_OBJ)) {
        return new error_OBJ(
          `argument to \`len\` not supported, got ${str[0].Type()}`
        );
      }
      return new Integer_OBJ(str[0].val.length);
    }),
  ],
  [
    "first",
    new Builtin((args: mk_Object[]) => {
      if (args.length != 1) {
        return new error_OBJ(
          `wrong number of arguments. got=${args.length}, want=1`
        );
      }
      if (!(args[0] instanceof Array_OBJ)) {
        return new error_OBJ(
          `argument to \`first\` not supported, got ${args[0].Type()}`
        );
      }
      if (args[0].elements.length > 0) {
        return args[0].elements[0];
      }
      return NULL;
    }),
  ],
  [
    "last",
    new Builtin((args: mk_Object[]) => {
      if (args.length != 1) {
        return new error_OBJ(
          `wrong number of arguments. got=${args.length}, want=1`
        );
      }
      if (!(args[0] instanceof Array_OBJ)) {
        return new error_OBJ(
          `argument to \`first\` not supported, got ${args[0].Type()}`
        );
      }
      if (args[0].elements.length > 0) {
        return args[0].elements[args[0].elements.length - 1];
      }
      return NULL;
    }),
  ],
  [
    "rest",
    new Builtin((args: mk_Object[]) => {
      if (args.length != 1) {
        return new error_OBJ(
          `wrong number of arguments. got=${args.length}, want=1`
        );
      }
      if (!(args[0] instanceof Array_OBJ)) {
        return new error_OBJ(
          `argument to \`rest\` not supported, got ${args[0].Type()}`
        );
      }
      if (args[0].elements.length > 0) {
        return new Array_OBJ(args[0].elements.slice(1));
      }
      return NULL;
    }),
  ],
  [
    "push",
    new Builtin((args: mk_Object[]) => {
      if (args.length != 2) {
        return new error_OBJ(
          `wrong number of arguments. got=${args.length}, want=2`
        );
      }
      if (!(args[0] instanceof Array_OBJ)) {
        return new error_OBJ(
          `argument to \`push\` not supported, got ${args[0].Type()}`
        );
      }
      // deep copy the array
      const arr = args[0].elements.slice();
      arr.push(args[1]);
      return new Array_OBJ(arr);
    }),
  ],
]);
