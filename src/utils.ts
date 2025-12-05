import { Err } from "./err";
import { Ok } from "./ok";
import type { Result } from "./result";

// @internal
export function isResult<V, E>(value: V | E | Result<V, E>): value is Result<V, E> {
  return value instanceof Ok || value instanceof Err;
}
