'use strict';

const { resolve, relative } = require('node:path');
const { readFile } = require('node:fs/promises');
const $refParser = require('@apidevtools/json-schema-ref-parser');

const cwd = process.cwd();

function parse(data, transformUrl) {
  return $refParser.bundle(data, {
    resolve: {
      file: {
        order: 1,
        canRead: true,
        read(file) {
          const url = transformUrl(file.url);

          return readFile(url, 'utf8');
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

  const { parser } = this.getOptions(schema) || {};

  const callback = this.async();

  const { context } = this;

  let data = '';

  try {
    data = JSON.parse(source);

    if (parser) {
      data = parser(data);
    }

    if (data) {
      parse(data, (url) => resolve(context, relative(cwd, url)))
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
