import { type AsyncResult, AsyncResultImpl } from "./async";
import { Err } from "./err";
import { Ok } from "./ok";
import type { Result } from "./result";

// Helper type to ensure the return value is not a Promise
type NoPromise<T> = T extends Promise<unknown> ? "Use Res.wrapAsync instead" : T;

/**
 * A factory for creating {@link Result} objects.
 */
export const Res = {
  ok: <V>(value: V): Ok<V, never> => new Ok(value),
  err: <E>(error: E): Err<never, E> => new Err(error),
  async: <V, E>(promise: Promise<Result<V, E>>): AsyncResult<V, E> => new AsyncResultImpl(promise),
  wrap: <V>(fn: () => NoPromise<V>): Result<NoPromise<V>, unknown> => {
    try {
      return new Ok(fn());
    } catch (e) {
      return new Err(e);
    }
  },
  wrapAsync: <V>(fn: () => Promise<V> | V): AsyncResult<V, unknown> =>
    new AsyncResultImpl(
      Promise.resolve()
        .then(fn)
        .then(
          (v) => new Ok(v),
          (e) => new Err(e),
        ),
    ),
} as const;
