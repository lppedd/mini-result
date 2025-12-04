// @internal
export function error(message: string, cause?: unknown): never {
  throw new Error(tag(message) + `\n  [cause] ${String(cause)}`, { cause });
}

function tag(message: string): string {
  return `[mini-result] ${message}`;
}
