# runtime-engine-check [![Build Status](https://travis-ci.org/sramam/runtime-engine-check.svg?branch=master)](https://travis-ci.org/sramam/runtime-engine-check)

> Validate process.version against package.json:engines.node


## Why
This is a simpler check than [check engines](https://www.npmjs.com/package/check-engines), making it much faster.

## Install

```
$ npm install --save runtime-engine-check
```

## Usage

```json
// in package.json
{
  ...
  "engines": {
    "node": ">=6.0.0"
  },
  ...
}
```
```js
require('runtime-engine-check')();
```
or
```js
import * as runtimeCheck from 'runtime-engine-check';
runtimeCheck();
```

## License

Apache-2.0
