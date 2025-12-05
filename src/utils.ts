import { type Result, ResultSymbol } from "./result";

// Helper type to ensure a raw return value is not 'RV | Result<RV, ...>'
export type NoResult<T> = T extends Result<any, any> ? "Raw value cannot be a Result" : T;

// @internal
export function isResult<V, E>(value: V | E | Result<V, E>): value is Result<V, E> {
  return (value as any).__result === ResultSymbol;
}
