import { error } from "./errors";
import { Ok } from "./ok";
import type { Result } from "./result";
import { isResult } from "./utils";

/**
 * Represents a failed result containing an error of type `E`.
 *
 * @template E The error value type.
 */
export class Err<E> implements Result<never, E> {
  private readonly myError: E;

  constructor(error: E) {
    this.myError = error;
  }

  error(): E {
    return this.myError;
  }

  isOk(): this is Ok<never> {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }

  map<RV>(_fn: (v: never) => RV): Result<RV, E> {
    return this;
  }

  mapErr<RE>(fn: (e: E) => RE): Result<never, RE> {
    return new Err(fn(this.myError));
  }

  catch<RV>(fn: (e: E) => Ok<RV>): Result<RV, E>;
  catch<RE>(fn: (e: E) => Err<RE>): Result<never, RE>;
  catch<RV, RE>(fn: (e: E) => Result<RV, RE>): Result<never | RV, RE>;
  catch<RV>(fn: (e: E) => RV): Result<RV, E>;
  catch<RV, RE>(fn: (e: E) => RV | Result<RV, RE>): Result<RV, RE> {
    const v = fn(this.myError);
    return isResult(v) ? v : new Ok(v);
  }

  match<R>(_ok: (v: never) => R, err: (e: E) => R): R {
    return err(this.myError);
  }

  unwrap(): never {
    error("an Err result does not have a value");
  }
}
