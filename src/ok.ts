/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Err } from "./err";
import type { IResult, Result } from "./result";

/**
 * Represents a successful result containing a value of type `V`.
 *
 * @template V The success value type.
 */
export class Ok<V, E> implements IResult<V, E> {
  private readonly myValue: V;

  constructor(value: V) {
    this.myValue = value;
  }

  value(): V {
    return this.myValue;
  }

  isOk(): this is Ok<V, E> {
    return true;
  }

  isErr(): this is Err<V, E> {
    return false;
  }

  map<RV>(fn: (v: V) => RV): Result<RV, E> {
    return new Ok(fn(this.myValue));
  }

  mapErr<RE>(fn: (e: E) => RE): Result<V, RE> {
    return this as unknown as Result<V, RE>;
  }

  catch<RV>(fn: (e: E) => Ok<RV, E>): Result<RV, E>;
  catch<RE>(fn: (e: E) => Err<V, RE>): Result<V, RE>;
  catch<RV, RE>(fn: (e: E) => Result<RV, RE>): Result<RV, RE>;
  catch<RV>(fn: (e: E) => RV): Result<RV, E>;
  catch<RV, RE>(fn: (e: E) => RV | Result<RV, RE>): Result<RV, RE> {
    return this as unknown as Result<RV, RE>;
  }

  match<R>(ok: (v: V) => R, err: (e: never) => R): R {
    return ok(this.myValue);
  }

  unwrap(): V {
    return this.myValue;
  }
}
