import type { Err } from "./err";
import { Ok } from "./ok";
import type { Result } from "./result";
import { isResult, type NoResult } from "./utils";

/**
 * Allows performing asynchronous operations on a {@link Result}.
 */
export interface AsyncResult<V, E> {
  /**
   * Returns the underlying {@link Result} object.
   */
  get(): Promise<Result<V, E>>;

  /**
   * Transforms the success value if this is an async {@link Ok} result, using a function
   * that returns another {@link Result}.
   *
   * This method is useful to _flatten_ chained async results.
   *
   * If this is an async {@link Err} result, its error value is preserved unchanged.
   */
  mapAsync<RV = V>(fn: (v: V) => Ok<RV, E> | Promise<Ok<RV, E>>): AsyncResult<RV, E>;
  mapAsync<RE = E>(fn: (v: V) => Err<V, RE> | Promise<Err<V, RE>>): AsyncResult<V, E | RE>;
  mapAsync<RV = V, RE = E>(fn: (v: V) => Result<RV, RE> | Promise<Result<RV, RE>>): AsyncResult<RV, E | RE>;

  /**
   * Transforms the success value if this is an async {@link Ok} result, using a raw value.
   *
   * Example:
   * ```ts
   * // getCores(): Promise<Result<number, Error>
   * // adjustCores(n): Promise<number>
   * const r = Res.from(getCores()).mapAsync((n) => adjustCores(n));
   * // r: AsyncResult<number, Error>
   * ```
   *
   * If this is an {@link Err} result, its error value is preserved unchanged.
   */
  mapAsync<RV = V>(fn: (v: V) => NoResult<RV> | Promise<NoResult<RV>>): AsyncResult<RV, E>;

  /**
   * Transforms the error value if this is an async {@link Err} result, using a function
   * that returns another {@link Result}.
   *
   * This method is useful for recovering from failures and _flattening_
   * chains of async results that operate on errors.
   *
   * If this is an async {@link Ok} result, its success value is preserved unchanged.
   */
  catchAsync<RV = V>(fn: (e: E) => Ok<RV, E> | Promise<Ok<RV, E>>): AsyncResult<V | RV, E>;
  catchAsync<RE = E>(fn: (e: E) => Err<V, RE> | Promise<Err<V, RE>>): AsyncResult<V, RE>;
  catchAsync<RV = V, RE = E>(fn: (e: E) => Result<RV, RE> | Promise<Result<RV, RE>>): AsyncResult<V | RV, RE>;

  /**
   * Replaces the error value with an {@link Ok} result using a raw value.
   *
   * Equivalent to writing:
   * ```ts
   * result.catchAsync((e) => Promise.resolve(Res.ok(value)))
   * ```
   *
   * If this is an async {@link Ok} result, its success value is preserved unchanged.
   */
  catchAsync<RV = V>(fn: (e: E) => NoResult<RV> | Promise<NoResult<RV>>): AsyncResult<V | RV, E>;

  /**
   * Exhaustively handles both the async {@link Ok} and {@link Err} result variants.
   *
   * Example:
   * ```ts
   * const r = await result.match(
   *   (v) => // Ok branch
   *   (e) => // Err branch
   * )
   * ```
   *
   * @param ok The function called when the result is `Ok`.
   * @param err The function called when the result is `Err`.
   */
  matchAsync<RV, RE>(ok: (v: V) => RV | Promise<RV>, err: (e: E) => RE | Promise<RE>): Promise<RV | RE>;

  /**
   * Returns the success value if this is an async {@link Ok} result, or throws
   * if this is an async {@link Err} result.
   *
   * @throws {Error} If this is an async {@link Err} result, which does not have a value.
   */
  unwrapAsync(): Promise<V>;

  /**
   * Returns the success value if this is an async {@link Ok} result, or falls back
   * to the value produced by the given function if this is an async {@link Err} result.
   */
  unwrapOrAsync<RV = V>(fn: (e: E) => RV | Promise<RV>): Promise<V | RV>;
}

// @internal
export class AsyncResultImpl<V, E> implements AsyncResult<V, E> {
  private readonly myPromise: Promise<Result<V, E>>;

  constructor(promise: Promise<Result<V, E>>) {
    this.myPromise = promise;
  }

  get(): Promise<Result<V, E>> {
    return this.myPromise;
  }

  mapAsync<RV = V>(fn: (v: V) => Ok<RV, E> | Promise<Ok<RV, E>>): AsyncResult<RV, E>;
  mapAsync<RE = E>(fn: (v: V) => Err<V, RE> | Promise<Err<V, RE>>): AsyncResult<V, E | RE>;
  mapAsync<RV = V, RE = E>(fn: (v: V) => Result<RV, RE> | Promise<Result<RV, RE>>): AsyncResult<RV, E | RE>;
  mapAsync<RV = V>(fn: (v: V) => NoResult<RV> | Promise<NoResult<RV>>): AsyncResult<RV, E>;
  mapAsync<RV = V, RE = E>(
    fn: (v: V) => RV | Promise<RV> | Result<V | RV, E | RE> | Promise<Result<V | RV, E | RE>>,
  ): AsyncResult<V | RV, E | RE> {
    const promise = this.myPromise
      .then((result) => (result.isOk() ? Promise.resolve(fn(result.value())) : result))
      .then((result) => (isResult(result) ? result : new Ok<V | RV, E | RE>(result)));
    return new AsyncResultImpl(promise);
  }

  catchAsync<RV = V>(fn: (e: E) => Ok<RV, E> | Promise<Ok<RV, E>>): AsyncResult<V | RV, E>;
  catchAsync<RE = E>(fn: (e: E) => Err<V, RE> | Promise<Err<V, RE>>): AsyncResult<V, RE>;
  catchAsync<RV = V, RE = E>(fn: (e: E) => Result<RV, RE> | Promise<Result<RV, RE>>): AsyncResult<V | RV, RE>;
  catchAsync<RV = V>(fn: (e: E) => NoResult<RV> | Promise<NoResult<RV>>): AsyncResult<V | RV, E>;
  catchAsync<RV, RE>(
    fn: (e: E) => RV | Promise<RV> | Result<V | RV, E | RE> | Promise<Result<V | RV, E | RE>>,
  ): AsyncResult<V | RV, E | RE> {
    const promise = this.myPromise
      .then((result) => (result.isErr() ? Promise.resolve(fn(result.error())) : result))
      .then((result) => (isResult(result) ? result : new Ok<V | RV, E | RE>(result)));
    return new AsyncResultImpl(promise);
  }

  matchAsync<RV, RE>(ok: (v: V) => RV | Promise<RV>, err: (e: E) => RE | Promise<RE>): Promise<RV | RE> {
    return this.myPromise.then((result) => (result.isOk() ? ok(result.value()) : err(result.error())));
  }

  unwrapAsync(): Promise<V> {
    return this.myPromise.then((result) => result.unwrap());
  }

  unwrapOrAsync<RV = V>(fn: (e: E) => RV | Promise<RV>): Promise<V | RV> {
    return this.myPromise.then((result) => (result.isOk() ? result.value() : fn(result.error())));
  }
}
