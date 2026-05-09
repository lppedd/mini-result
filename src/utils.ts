import { type Result, ResultSymbol } from "./result";

// Helper type to ensure a raw return value is not 'RV | Result<RV, ...>'
export type RawValue<T> = T extends Result<any, any> ? "Function return value cannot be a Result" : T;

// Helper type to ensure the return value is not a Promise
export type SyncValue<T> = T extends Promise<any> ? "Use Res.wrapAsync when returning a Promise" : T;

// @internal
export function isResult<V, E>(value: V | E | Result<V, E>): value is Result<V, E> {
  return (value as any).__result === ResultSymbol;
}
