import { type AsyncResult, AsyncResultImpl } from "./async";
import { Err } from "./err";
import { Ok } from "./ok";
import type { Result } from "./result";
import type { RawValue, SyncValue } from "./utils";

/**
 * A factory for creating and composing {@link Result|Results}.
 *
 * @example
 * ```ts
 * const success = Res.ok(42);
 * const failure = Res.err(new Error("Invalid input"));
 * ```
 */
export const Res = {
  /**
   * Creates a successful {@link Result}.
   *
   * @example
   * ```ts
   * const result = Res.ok(successRc);
   * ```
   *
   * @param value The value to wrap.
   * @returns An {@link Ok} result containing the provided value.
   */
  ok: <V>(value: V): Ok<V, never> => new Ok(value),

  /**
   * Creates a failed {@link Result}.
   *
   * @example
   * ```ts
   * const result = Res.err(new Error("Invalid input"));
   * ```
   *
   * @param error The error to wrap.
   * @returns An {@link Err} result containing the provided error.
   */
  err: <E>(error: E): Err<never, E> => new Err(error),

  /**
   * Creates an {@link AsyncResult} from a promise that resolves to a {@link Result}.
   *
   * Useful for chaining asynchronous result operations without manually awaiting
   * the underlying promise.
   *
   * @example
   * ```ts
   * const result = Res.async(fetchUser());
   * ```
   *
   * @param promise A promise resolving to a {@link Result}.
   * @returns An {@link AsyncResult} wrapping the provided promise.
   */
  async: <V, E>(promise: Promise<Result<V, E>>): AsyncResult<V, E> => new AsyncResultImpl(promise),

  /**
   * Executes a synchronous function and wraps its return value in a {@link Result}.
   *
   * @example
   * ```ts
   * const result = Res.wrap(() => JSON.parse(jsonStr));
   * ```
   *
   * @param fn The synchronous function to execute.
   * @returns A {@link Result} containing either the returned value or the captured error.
   */
  wrap: <V>(fn: () => SyncValue<V>): Result<SyncValue<V>, unknown> => {
    try {
      return new Ok(fn());
    } catch (e) {
      return new Err(e);
    }
  },

  /**
   * Executes a synchronous or asynchronous function and wraps its return value in an {@link AsyncResult}.
   *
   * @example
   * ```ts
   * const result = Res.wrapAsync(async () => {
   *   const response = await fetch(`/api/user/${userId}`);
   *   return response.json();
   * });
   * ```
   *
   * @param fn The synchronous or asynchronous function to execute.
   * @returns An {@link AsyncResult} containing either the resolved value or the captured error.
   */
  wrapAsync: <V>(fn: () => Promise<RawValue<V>> | RawValue<V>): AsyncResult<RawValue<V>, unknown> =>
    new AsyncResultImpl(
      Promise.resolve()
        .then(fn)
        .then(
          (v) => new Ok(v),
          (e) => new Err(e),
        ),
    ),
} as const;
