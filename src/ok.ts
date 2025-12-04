import type { Err } from "./err";
import type { Result } from "./result";

/**
 * Represents a successful result containing a value of type `V`.
 *
 * @template V The success value type.
 */
export class Ok<V> implements Result<V, never> {
  private readonly myValue: V;

  constructor(value: V) {
    this.myValue = value;
  }

  value(): V {
    return this.myValue;
  }

  isOk(): this is Ok<V> {
    return true;
  }

  isErr(): this is Err<never> {
    return false;
  }

  map<RV>(fn: (v: V) => RV): Result<RV, never> {
    return new Ok(fn(this.myValue));
  }

  mapErr<RE>(_fn: (e: never) => RE): Result<V, RE> {
    return this;
  }

  catch<RV>(_fn: (e: never) => Ok<RV>): Result<RV, never>;
  catch<RE>(_fn: (e: never) => Err<RE>): Result<V, RE>;
  catch<RV, RE>(_fn: (e: never) => Result<RV, RE>): Result<RV, RE>;
  catch<RV>(_fn: (e: never) => RV): Result<RV, never>;
  catch<RV, RE>(_fn: (e: never) => RV | Result<RV, RE>): Result<RV, RE> {
    return this as unknown as Result<RV, RE>;
  }

  match<R>(ok: (v: V) => R, _err: (e: never) => R): R {
    return ok(this.myValue);
  }

  unwrap(): V {
    return this.myValue;
  }
}
