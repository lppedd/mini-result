import { Err } from "./err";
import { Ok } from "./ok";

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
   * Transforms the success value if this is an {@link Ok} result,
   * or leaves the error value unchanged if this is an {@link Err} result.
   */
  map<RV = V>(fn: (v: V) => RV): Result<RV, E>;

  /**
   * Transforms the error value if this is an {@link Err} result,
   * or leaves the success value unchanged if this is an {@link Ok} result.
   */
  mapErr<RE = E>(fn: (e: E) => RE): Result<V, RE>;

  /**
   * Replaces the error value with an {@link Ok} result.
   *
   * Example:
   * ```
   * result.catch((e) => Res.ok("defaultValue"))
   * ```
   *
   * Equivalent to writing:
   *
   * ```ts
   * result.catch((e) => "defaultValue")
   * ```
   */
  catch<RV = V>(fn: (e: E) => Ok<RV, E>): Result<V | RV, E>;

  /**
   * Replaces the error value with another {@link Err} result.
   *
   * Example:
   * ```ts
   * result.catch((e) => Res.err("response error: ${e.message}"))
   * ```
   */
  catch<RE = E>(fn: (e: E) => Err<V, RE>): Result<V, RE>;

  /**
   * Replaces the error value with an arbitrary {@link Ok} or {@link Err} result.
   */
  catch<RV = V, RE = E>(fn: (e: E) => Result<RV, RE>): Result<V | RV, RE>;

  /**
   * Replaces the error value with an {@link Ok} result using a raw value.
   *
   * Equivalent to writing:
   *
   * ```ts
   * result.catch((e) => Res.ok(value))
   * ```
   */
  catch<RV = V>(fn: (e: E) => RV): Result<V | RV, E>;

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
  match<R>(ok: (v: V) => R, err: (e: E) => R): R;

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
