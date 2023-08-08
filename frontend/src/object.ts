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
