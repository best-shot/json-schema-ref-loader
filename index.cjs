'use strict';

const { readFile } = require('node:fs/promises');
const $refParser = require('@apidevtools/json-schema-ref-parser');

function parse({ data, resourcePath, dereference }) {
  const func = dereference ? 'dereference' : 'bundle';

  return $refParser[func](resourcePath, data, {
    resolve: {
      file: {
        order: 5,
        read(file) {
          return readFile(file.url, 'utf8');
        },
      },
    },
  });
}

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    parser: {
      instanceof: 'Function',
    },
    dereference: {
      default: false,
      oneOf: [
        {
          type: 'boolean',
        },
        {
          instanceof: 'Function',
        },
      ],
    },
  },
};

module.exports = function loader(source) {
  this.cacheable();

  const { parser, dereference } = this.getOptions(schema) || {};

  const callback = this.async();

  const { resourcePath } = this;

  let data = '';

  try {
    data = JSON.parse(source);

    const should = Boolean(
      typeof dereference === 'function' ? dereference(data) : dereference,
    );

    if (parser) {
      data = parser(data);
    }

    if (data) {
      parse({ data, resourcePath, dereference: should })
        .then((io) => {
          callback(null, JSON.stringify(io));
        })
        .catch((error) => {
          callback(error);
        });
    } else {
      callback(null, JSON.stringify(data));
    }
  } catch (error) {
    callback(error);
  }
};
