# Changelog

## 0.4.0

- Added support for tapping into the error state via `Result.tap`.

  ```ts
  result.tap((n) => console.log(n), (e) => console.error(e));
  ```

## 0.3.1

- Relaxed compilation target to ES2015.

## 0.3.0

- Refactored internals to further reduce the bundle size.
- Moved the project status to **Beta**.

## 0.2.0

- Introduced `Result.tap`, to execute a side effect on a result.

## 0.1.1

- Refactored internals to slightly reduce the bundle size.

## 0.1.0

Initial release.
