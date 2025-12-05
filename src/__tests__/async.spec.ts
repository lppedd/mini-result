// noinspection GrazieInspection

import { describe, expect, it } from "vitest";

import { type Err, Res, type Result } from "..";

describe("AsyncResult", () => {
  it("should be ok", async () => {
    const asyncOk = Res.from(Promise.resolve(Res.ok(1)));
    await expect(asyncOk.unwrapAsync()).resolves.toBe(1);

    const ok = await asyncOk.get();
    expect(ok.isOk()).toBe(true);
    expect(ok.isErr()).toBe(false);
    expect(ok.unwrap()).toBe(1);
  });

  it("should be error", async () => {
    const asyncOk = Res.from(Promise.resolve(Res.err(new Error("msg"))));
    await expect(asyncOk.unwrapAsync()).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [Error: [mini-result] cannot unwrap an Err result
        [cause] Error: msg]
      `,
    );

    const ok = await asyncOk.get();
    expect(ok.isOk()).toBe(false);
    expect(ok.isErr()).toBe(true);
    expect(() => ok.unwrap()).toThrowErrorMatchingInlineSnapshot(
      `
      [Error: [mini-result] cannot unwrap an Err result
        [cause] Error: msg]
      `,
    );
  });

  it("should unwrap or call async function", async () => {
    const asyncOk = Res.from(Promise.resolve(Res.ok(2)));
    const num = await asyncOk.unwrapOrAsync(() => "15");
    expect(num).toBe(2);

    const asyncErr = Res.from(Promise.resolve(Res.err(new Error("msg"))));
    const str = await asyncErr.unwrapOrAsync(() => Promise.resolve("15"));
    expect(str).toBe("15");
  });

  it("should map Ok result to async", async () => {
    function getNumber(): Promise<number> {
      return Promise.resolve(2);
    }

    const result = Res.ok(1)
      .mapAsync((v) => getNumber().then((n) => n + v))
      .mapAsync((v) => `number: ${v}`)
      .mapAsync((v) => Res.err(`error for ${v}`))
      .catchAsync((e) => Res.err(`${e}. Caught`));

    await expect(() => result.unwrapAsync()).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [Error: [mini-result] cannot unwrap an Err result
        [cause] error for number: 3. Caught]
      `,
    );
  });

  it("should map Err result to async", async () => {
    function getErrResult(): Err<number, Error> {
      return Res.err(new Error("msg"));
    }

    function getNumber(): Promise<number> {
      return Promise.resolve(2);
    }

    const result = getErrResult()
      .mapAsync((v) => getNumber().then((n) => n + v))
      .mapAsync((v) => `number: ${v}`)
      .mapAsync((v) => Res.err(`error for ${v}`))
      .catchAsync((e) => Res.err(`${e}. Caught`));

    await expect(() => result.unwrapAsync()).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [Error: [mini-result] cannot unwrap an Err result
        [cause] Error: msg. Caught]
      `,
    );
  });

  it("should catch Ok result to async", async () => {
    function getResult(): Result<number, Error> {
      return Res.ok(2);
    }

    const result = getResult().catchAsync((e) => `fallback. Caught ${e.message}`);
    await expect(result.unwrapAsync()).resolves.toBe(2);
  });

  it("should catch Err result to async", async () => {
    function getResult(): Result<number, Error> {
      return Res.err(new Error("msg"));
    }

    const result = getResult()
      .catchAsync((e) => `fallback. Caught ${e.message}`)
      .mapAsync((v) => `value: ${v}`);

    await expect(result.unwrapAsync()).resolves.toBe("value: fallback. Caught msg");
  });

  it("should match both async Ok and Err", async () => {
    const asyncOk = Res.from(Promise.resolve(Res.ok(1)));
    const okValue = await asyncOk.matchAsync(
      (v) => v + 1,
      () => "12",
    );

    expect(okValue).toBe(2);

    const asyncErr = Res.from(Promise.resolve(Res.err(2)));
    const errValue = await asyncErr.matchAsync(
      () => 1,
      (e) => e + 1,
    );

    expect(errValue).toBe(3);
  });
});
