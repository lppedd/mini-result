<!--suppress HtmlDeprecatedAttribute -->
<h1 align="center">mini-result</h1>
<p align="center">Minimal Result type for TypeScript</p>
<div align="center">

[![ecmascript](https://img.shields.io/badge/ES-2022-blue?logo=javascript)](https://en.wikipedia.org/wiki/ECMAScript_version_history#13th_edition_%E2%80%93_ECMAScript_2022)
[![status](https://img.shields.io/badge/status-alpha-DB3683)](https://github.com/lppedd/mini-result)
[![build](https://img.shields.io/github/actions/workflow/status/lppedd/mini-result/test.yml.svg?branch=main)](https://github.com/lppedd/mini-result/actions/workflows/test.yml)
[![license](https://img.shields.io/badge/license-MIT-F7F7F7)](https://github.com/lppedd/mini-result/blob/main/LICENSE)

</div>

## Design considerations

**mini-result** is inspired by existing `Result`-type libraries such as:

- neverthrow (https://github.com/sindresorhus/neverthrow)
- byethrow (https://github.com/praha-inc/byethrow)
- ts-result (https://github.com/trylonai/ts-result)

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
