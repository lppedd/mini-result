// @internal
export function error(message: string): never {
  throw new Error(tag(message));
}

function tag(message: string): string {
  return `[mini-result] ${message}`;
}
