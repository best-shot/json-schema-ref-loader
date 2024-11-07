# @best-shot/json-schema-ref-loader

`json-schema-ref-parser` for `webpack`.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/json-schema-ref-loader
[npm-badge]: https://img.shields.io/npm/v/@best-shot/json-schema-ref-loader.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/json-schema-ref-loader
[github-badge]: https://img.shields.io/npm/l/@best-shot/json-schema-ref-loader.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/json-schema-ref-loader.svg?style=flat-square&colorB=green&logo=node.js

## Installation

```bash
npm install @best-shot/json-schema-ref-loader --save-dev
```

## Usage

```cjs
// example: webpack.config.cjs
module.exports = {
  module: {
    rules: [
      {
        test: /\.(ya?ml|json)$/,
        type: 'asset/resource',
        loader: '@best-shot/json-schema-ref-loader',
        options: {
          dereference: false
        }
      },
      {
        test: /\.ya?ml$/,
        loader: 'yaml-loader'
      }
    ]
  }
};
```
