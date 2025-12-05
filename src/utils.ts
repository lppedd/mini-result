import { Err } from "./err";
import { Ok } from "./ok";
import type { Result } from "./result";

export type NoResult<T> = T extends Result<any, any> ? "Raw value cannot be a Result" : T;

// @internal
export function isResult<V, E>(value: V | E | Result<V, E>): value is Result<V, E> {
  return value instanceof Ok || value instanceof Err;
}
