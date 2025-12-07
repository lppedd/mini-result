// noinspection GrazieInspection

import { describe, expect, it, vi } from "vitest";

import { Res, type Result } from "..";

describe("Result", () => {
  it("should be Ok", () => {
    const ok = Res.ok(1);
    expect(ok.isOk()).toBe(true);
    expect(ok.isErr()).toBe(false);
    expect(ok.value).toBe(1);
  });

  it("should be Err", () => {
    const err = Res.err(new Error("msg"));
    expect(err.isOk()).toBe(false);
    expect(err.isErr()).toBe(true);
    expect(err.error).toStrictEqual(new Error("msg"));
  });

  it("should map Ok result", () => {
    function getOkResult(): Result<number, Error> {
      return Res.ok(1);
    }

    const result = getOkResult()
      .catch(() => 20)
      .map((v) => v + 1)
      .map((v) => `number: ${v}`)
      .catch((e) => Res.err(`${e.message} fallback`));

    expect(result.isOk()).toBe(true);
    expect(result.isErr()).toBe(false);

    const value = result.isOk() ? result.value : undefined;
    expect(value).toStrictEqual("number: 2");
  });

  it("should map Err result", () => {
    function getErrResult(): Result<number, Error> {
      return Res.err(new Error("msg"));
    }

    const result = getErrResult()
      .map((v) => v + 1)
      .catch((e) => Res.err(new Error(`mapped ${e.message}`)))
      .catch((e) => Res.err(`mapped ${e.message}`))
      .catch((e) => `${e} fallback`);

    expect(result.isOk()).toBe(true);
    expect(result.isErr()).toBe(false);

    const value = result.isOk() ? result.value : undefined;
    expect(value).toStrictEqual("mapped mapped msg fallback");
  });

  it("should map to another result", () => {
    function getOkResult(): Result<number, Error> {
      return Res.ok(1);
    }

    function getAnotherResult(n: number): Result<string, { error: string }> {
      return Res.ok((n + 1).toString());
    }

    const result = getOkResult()
      .map((v) => getAnotherResult(v))
      .map((v) => `number: ${v}`)
      .catch((e) => {
        if (e instanceof Error) {
          return Res.err(`${e} fallback`);
        } else {
          return Res.err(`${e.error} fallback`);
        }
      });

    expect(result.isOk()).toBe(true);
    expect(result.isErr()).toBe(false);

    const value = result.isOk() ? result.value : undefined;
    expect(value).toStrictEqual("number: 2");
  });

  it("should tap result", () => {
    const fn = vi.fn();
    const value = Res.ok(1)
      .map((v) => v + 1)
      .tap(fn)
      .map((v) => v + 1)
      .unwrap();

    expect(fn).toHaveBeenCalledExactlyOnceWith(2);
    expect(value).toBe(3);
  });

  it("should skip tap when Err result", () => {
    const fn = vi.fn();
    const result = Res.ok(1)
      .map((v) => v + 1)
      .map((v) => Res.err(`error for ${v}`))
      .tap(fn)
      .map((v) => v + 1);

    expect(result.isErr()).toBe(true);
    expect(fn).not.toHaveBeenCalled();
  });

  it("should match both Ok and Err", () => {
    const okValue = Res.ok(1).match(
      (v) => v + 1,
      () => "12",
    );

    expect(okValue).toBe(2);

    const errValue = Res.err(2).match(
      () => 1,
      (e) => e + 1,
    );

    expect(errValue).toBe(3);
  });

  it("should unwrap an Ok result", () => {
    const result = Res.ok(20);
    expect(result.unwrap()).toBe(20);
    expect(result.unwrapOr(() => "15")).toBe(20);
  });

  it("should not unwrap an Err result", () => {
    const result = Res.err(new Error("example cause"));
    expect(() => result.unwrap()).toThrowErrorMatchingInlineSnapshot(
      `
      [Error: [mini-result] cannot unwrap an Err result
        [value] Error: example cause]
      `,
    );

    expect(result.unwrapOr(() => "unwrapped")).toBe("unwrapped");
  });
});
