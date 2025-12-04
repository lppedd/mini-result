/* eslint-disable @typescript-eslint/no-unused-vars */

import { error } from "./errors";
import { Ok } from "./ok";
import type { IResult, Result } from "./result";
import { isResult } from "./utils";

/**
 * Represents a failed result containing an error of type `E`.
 *
 * @template E The error value type.
 */
export class Err<V, E> implements IResult<V, E> {
  private readonly myError: E;

  constructor(error: E) {
    this.myError = error;
  }

  error(): E {
    return this.myError;
  }

  isOk(): this is Ok<V, E> {
    return false;
  }

  isErr(): this is Err<V, E> {
    return true;
  }

  map<RV = V>(fn: (v: V) => RV): Result<RV, E> {
    return this as unknown as Result<RV, E>;
  }

  mapErr<RE = E>(fn: (e: E) => RE): Result<V, RE> {
    return new Err(fn(this.myError));
  }

  catch<RV = V>(fn: (e: E) => Ok<RV, E>): Result<V | RV, E>;
  catch<RE = E>(fn: (e: E) => Err<V, RE>): Result<V, RE>;
  catch<RV = V, RE = E>(fn: (e: E) => Result<RV, RE>): Result<V | RV, RE>;
  catch<RV = V>(fn: (e: E) => RV): Result<V | RV, E>;
  catch<RV = V, RE = E>(fn: (e: E) => RV | Result<RV, RE>): Result<V | RV, RE> {
    const v = fn(this.myError);
    return isResult(v) ? v : new Ok(v);
  }

  match<R>(ok: (v: V) => R, err: (e: E) => R): R {
    return err(this.myError);
  }

  unwrap(): V {
    error("an Err result does not have a value");
  }
}
