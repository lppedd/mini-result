<!--suppress HtmlDeprecatedAttribute -->
<h1 align="center">mini-result</h1>
<p align="center">Minimal Result type for TypeScript</p>
<div align="center">

[![npm](https://img.shields.io/npm/v/@lppedd/mini-result?color=%23de1f1f&logo=npm)](https://www.npmjs.com/package/@lppedd/mini-result)
[![ecmascript](https://img.shields.io/badge/ES-2022-blue?logo=javascript)](https://en.wikipedia.org/wiki/ECMAScript_version_history#13th_edition_%E2%80%93_ECMAScript_2022)
[![status](https://img.shields.io/badge/status-beta-AC29EC)](https://github.com/lppedd/mini-result)
[![build](https://img.shields.io/github/actions/workflow/status/lppedd/mini-result/test.yml.svg?branch=main)](https://github.com/lppedd/mini-result/actions/workflows/test.yml)
[![minified size](https://img.shields.io/bundlejs/size/@lppedd/mini-result)](https://bundlejs.com/?q=@lppedd/mini-result)
[![license](https://img.shields.io/badge/license-MIT-F7F7F7)](https://github.com/lppedd/mini-result/blob/main/LICENSE)

</div>

## Design considerations

**mini-result** is inspired by existing `Result`-type libraries such as:

- [neverthrow](https://github.com/sindresorhus/neverthrow)
- [byethrow](https://github.com/praha-inc/byethrow)
- [ts-result](https://github.com/trylonai/ts-result)

However, unlike these libraries, **mini-result** intentionally focuses on minimalism.
Rather than looking for features, tree-shakability or performance, it aims to provide a tiny
and easy-to-understand `Result` type with just the essentials needed for practical error handling.

## Installation

```sh
npm i @lppedd/mini-result
```

```sh
pnpm add @lppedd/mini-result
```

```sh
yarn add @lppedd/mini-result
```

## Operations

Fundamentally, `Result` offers only **5** operations: `map`, `tap`, `catch`, `unwrap` and `unwrapOr`.  
Those operations are also split into **synchronous** and **asynchronous** (suffixed with `*Async`) variants.

But let's start with creating an `Ok` or `Err` result.

### Result factory

```ts
import { Res } from "@lppedd/mini-result";

const ok = Res.ok(1);        // Ok<number, never>
const er = Res.err("error"); // Err<never, string>,
```

### Result.map

Transforms the result's success value. No-op if the result represents an error state.

```ts
// result: Result<number, Error>
const r = result.map((n) => n + 1);
const r = result.map((n) => compute(n)); // () => Result<number, Error>
```

### Result.tap

Invokes a function with the result's success value. No-op if the result represents an error state.

```ts
// result: Result<number, Error>
const r = result.tap((n) => console.log(n));
```

### Result.catch

Catches and transforms the result's error value. No-op if the result represents a success state.

```ts
// result: Result<number, Error>
// Transform the error value from Error to string
const r = result.catch((e) => Res.err(e.message));

// Replace the error value with a success value
const r = result.catch((e) => defaultValue);
// Or
const r = result.catch((e) => Res.ok(defaultValue));

// Replaces the error value with a new result (which might be a success or error itself)
const r = result.catch((e) => computeDefault()); // (e) => Result<number, Error>
```

### Result.unwrap

Unwraps the result's success value.

```ts
// result: Result<number, Error>
// n: number
const n = result.unwrap();
```

Or throws an `Error` if the result represents an error state.

```text
[mini-result] cannot unwrap an Err result
  [value] Error: invalid number
```

### Result.unwrapOr

Unwraps the result's success value, or falls back to the value returned by the given
function if the result represents an error state.

```ts
// result: Result<number, Error>
// n: number
const n = result.unwrapOr((e) => defaultValue);
```

## License

[MIT][license] 2025-present Edoardo Luppi

[license]: https://github.com/lppedd/mini-result/blob/main/LICENSE
