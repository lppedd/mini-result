import { type AsyncResult, AsyncResultImpl } from "./async";
import { Err } from "./err";
import { Ok } from "./ok";
import type { Result } from "./result";

/**
 * A factory for creating {@link Result} objects.
 */
export const Res = {
  ok: <V>(value: V): Ok<V, never> => new Ok(value),
  err: <E>(error: E): Err<never, E> => new Err(error),
  async: <V, E>(promise: Promise<Result<V, E>>): AsyncResult<V, E> => new AsyncResultImpl(promise),
} as const;
