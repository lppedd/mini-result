// noinspection GrazieInspection

import { describe, expect, it } from "vitest";

import { Res, type Result } from "../result";

describe("Result", () => {
  it("should be ok", () => {
    const ok = Res.ok(1);
    expect(ok.isOk()).toBe(true);
    expect(ok.isErr()).toBe(false);
    expect(ok.value()).toBe(1);
  });

  it("should be error", () => {
    const err = Res.err(new Error("msg"));
    expect(err.isOk()).toBe(false);
    expect(err.isErr()).toBe(true);
    expect(err.error()).toStrictEqual(new Error("msg"));
  });

  it("should map error", () => {
    function getErrResult(): Result<number, Error> {
      return Res.err(new Error("msg"));
    }

    const result = getErrResult()
      .map((v) => v + 1)
      .mapErr((e) => new Error(`mapped ${e.message}`))
      .catch((e) => Res.err(`mapped ${e.message}`))
      .catch((e) => `${e} fallback`);

    expect(result.isOk()).toBe(true);
    expect(result.isErr()).toBe(false);

    const value = result.isOk() ? result.value() : undefined;
    expect(value).toStrictEqual("mapped mapped msg fallback");
  });

  it("should map ok", () => {
    function getOkResult(): Result<number, Error> {
      return Res.ok(1);
    }

    const result = getOkResult()
      .catch(() => 20)
      .map((v) => v + 1)
      .map((v) => `number: ${v}`)
      .mapErr((e) => `${e.message} fallback`);

    expect(result.isOk()).toBe(true);
    expect(result.isErr()).toBe(false);

    const value = result.isOk() ? result.value() : undefined;
    expect(value).toStrictEqual("number: 2");
  });

  it("should match both Ok and Err", () => {
    const okValue = Res.ok(1).match(
      (v) => v + 1,
      () => 12,
    );

    expect(okValue).toBe(2);

    const errValue = Res.err(2).match(
      () => 1,
      (e) => e + 1,
    );

    expect(errValue).toBe(3);
  });

  it("should unwrap an Ok result", () => {
    const value = Res.ok(20).unwrap();
    expect(value).toBe(20);
  });

  it("should not unwrap an Err result", () => {
    expect(() => Res.err("error").unwrap()).toThrowErrorMatchingInlineSnapshot(
      `[Error: [mini-result] an Err result does not have a value]`,
    );
  });
});
