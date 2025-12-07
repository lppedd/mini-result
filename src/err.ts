/* eslint-disable @typescript-eslint/no-unused-vars */

import { type AsyncResult, AsyncResultImpl } from "./async";
import { Ok } from "./ok";
import { type IResult, type Result, ResultSymbol } from "./result";
import { isResult, type NoResult } from "./utils";

/**
 * Represents a failed result containing an error of type `E`.
 *
 * @template E The error value type.
 */
export class Err<V, E> implements IResult<V, E> {
  readonly error: E;

  /**
   * @internal
   */
  readonly __result: symbol = ResultSymbol;

  constructor(error: E) {
    this.error = error;
  }

  isOk(): this is Ok<V, E> {
    return false;
  }

  isErr(): this is Err<V, E> {
    return true;
  }

  map<RV = V>(fn: (v: V) => Ok<RV, E>): Result<RV, E>;
  map<RE = E>(fn: (v: V) => Err<V, RE>): Result<V, E | RE>;
  map<RV = V, RE = E>(fn: (v: V) => Result<RV, RE>): Result<RV, E | RE>;
  map<RV = V>(fn: (v: V) => NoResult<RV>): Result<RV, E>;
  map<RV = V, RE = E>(fn: (v: V) => RV | Result<RV, RE>): Result<V | RV, E | RE> {
    return this;
  }

  mapAsync<RV = V>(fn: (v: V) => Promise<Ok<RV, E>>): AsyncResult<RV, E>;
  mapAsync<RE = E>(fn: (v: V) => Promise<Err<V, RE>>): AsyncResult<V, E | RE>;
  mapAsync<RV = V, RE = E>(fn: (v: V) => Promise<Result<RV, RE>>): AsyncResult<RV, E | RE>;
  mapAsync<RV = V>(fn: (v: V) => NoResult<RV> | Promise<NoResult<RV>>): AsyncResult<RV, E>;
  mapAsync<RV = V, RE = E>(fn: (v: V) => RV | Promise<RV> | Promise<Result<V | RV, E | RE>>): AsyncResult<V | RV, E | RE> {
    return new AsyncResultImpl(Promise.resolve(this));
  }

  tap(fn: (v: V) => unknown): Result<V, E> {
    return this;
  }

  catch<RV = V>(fn: (e: E) => Ok<RV, E>): Result<V | RV, E>;
  catch<RE = E>(fn: (e: E) => Err<V, RE>): Result<V, RE>;
  catch<RV = V, RE = E>(fn: (e: E) => Result<RV, RE>): Result<V | RV, RE>;
  catch<RV = V>(fn: (e: E) => NoResult<RV>): Result<V | RV, E>;
  catch<RV = V, RE = E>(fn: (e: E) => RV | Result<RV, RE>): Result<V | RV, E | RE> {
    const value = fn(this.error);
    return isResult(value) ? value : new Ok(value);
  }

  catchAsync<RV = V>(fn: (e: E) => Promise<Ok<RV, E>>): AsyncResult<V | RV, E>;
  catchAsync<RE = E>(fn: (e: E) => Promise<Err<V, RE>>): AsyncResult<V, RE>;
  catchAsync<RV = V, RE = E>(fn: (e: E) => Promise<Result<RV, RE>>): AsyncResult<V | RV, RE>;
  catchAsync<RV = V>(fn: (e: E) => NoResult<RV> | Promise<NoResult<RV>>): AsyncResult<V | RV, E>;
  catchAsync<RV = V, RE = E>(fn: (e: E) => RV | Promise<RV> | Promise<Result<V | RV, E | RE>>): AsyncResult<V | RV, E | RE> {
    return new AsyncResultImpl(Promise.resolve(fn(this.error)).then((v) => (isResult(v) ? v : new Ok(v))));
  }

  match<RV, RE = RV>(ok: (v: V) => RV, err: (e: E) => RE): RV | RE {
    return err(this.error);
  }

  unwrap(): V {
    throw new Error(`[mini-result] cannot unwrap an Err result\n  [value] ${String(this.error)}`, {
      cause: this.error,
    });
  }

  unwrapOr<RV = V>(fn: (e: E) => RV): V | RV {
    return fn(this.error);
  }
}
