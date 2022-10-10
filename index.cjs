'use strict';

const { readFile } = require('node:fs/promises');
const $refParser = require('@apidevtools/json-schema-ref-parser');

function parse(data, resourcePath) {
  return $refParser.dereference(resourcePath, data, {
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
  },
};

module.exports = function loader(source) {
  this.cacheable();

  const { parser } = this.getOptions?.(schema) || {};

  const callback = this.async();

  const { resourcePath } = this;

  let data = '';

  try {
    data = JSON.parse(source);

    if (parser) {
      data = parser(data);
    }

    if (data) {
      parse(data, resourcePath)
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
