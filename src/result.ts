import { Err } from "./err";
import { Ok } from "./ok";
import type { NoResult } from "./utils";

export interface IResult<V, E> {
  /**
   * Returns `true` if this is an {@link Ok} result.
   */
  isOk(): this is Ok<V, E>;

  /**
   * Returns `true` if this is an {@link Err} result.
   */
  isErr(): this is Err<V, E>;

  /**
   * Transforms the success value if this is an {@link Ok} result, using a function
   * that returns another {@link Result}.
   *
   * This method is useful to _flatten_ chained results.
   *
   * If this is an {@link Err} result, its error value is preserved unchanged.
   */
  map<RV = V>(fn: (v: V) => Ok<RV, E>): Result<RV, E>;
  map<RE = E>(fn: (v: V) => Err<V, RE>): Result<V, E | RE>;
  map<RV = V, RE = E>(fn: (v: V) => Result<RV, RE>): Result<RV, E | RE>;

  /**
   * Transforms the success value if this is an {@link Ok} result, using a raw value.
   *
   * Example:
   * ```ts
   * const r = getCores().map((n) => n * 3); // Ok(n * 3)
   * ```
   *
   * If this is an {@link Err} result, its error value is preserved unchanged.
   */
  map<RV = V>(fn: (v: V) => NoResult<RV>): Result<RV, E>;

  /**
   * Transforms the error value if this is an {@link Err} result, using a function
   * that returns another {@link Result}.
   *
   * This method is useful for recovering_from failures and _flattening_
   * chains of results that operate on errors.
   *
   * If this is an {@link Ok} result, its success value is preserved unchanged.
   */
  catch<RV = V>(fn: (e: E) => Ok<RV, E>): Result<V | RV, E>;
  catch<RE = E>(fn: (e: E) => Err<V, RE>): Result<V, RE>;
  catch<RV = V, RE = E>(fn: (e: E) => Result<RV, RE>): Result<V | RV, RE>;

  /**
   * Replaces the error value with an {@link Ok} result using a raw value.
   *
   * Equivalent to writing:
   * ```ts
   * result.catch((e) => Res.ok(value))
   * ```
   *
   * If this is an {@link Ok} result, its success value is preserved unchanged.
   */
  catch<RV = V>(fn: (e: E) => NoResult<RV>): Result<V | RV, E>;

  /**
   * Exhaustively handles both the {@link Ok} and {@link Err} result variants.
   *
   * Example:
   * ```ts
   * const r = result.match(
   *   (v) => // Ok branch
   *   (e) => // Err branch
   * )
   * ```
   *
   * @param ok The function called when the result is `Ok`.
   * @param err The function called when the result is `Err`.
   */
  match<RV, RE = RV>(ok: (v: V) => RV, err: (e: E) => RE): RV | RE;

  /**
   * Returns the success value, or throws if this is an {@link Err} result.
   *
   * @throws {Error} If this is an {@link Err} result, which does not have a value.
   */
  unwrap(): V;

  /**
   * Returns the success value, or falls back to the value produced by the given
   * function if this is an {@link Err} result.
   */
  unwrapOr<RV = V>(fn: (e: E) => RV): V | RV;
}

/**
 * Represents the result of an operation that may succeed (`Ok<V>`) or fail (`Err<E>`).
 *
 * @template V The success value type.
 * @template E The error value type.
 */
export type Result<V, E> = Ok<V, E> | Err<V, E>;

export const Res = {
  ok: <V>(value: V): Ok<V, never> => new Ok(value),
  err: <E>(error: E): Err<never, E> => new Err(error),
} as const;
