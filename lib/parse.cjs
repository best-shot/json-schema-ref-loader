'use strict';

const { readFile } = require('node:fs/promises');
const $refParser = require('@apidevtools/json-schema-ref-parser');

module.exports = function parse({ data, resourcePath }) {
  return $refParser.dereference(resourcePath, data, {
    resolve: {
      npm: {
        canRead: /^npm:/i,
        read(file, callback) {
          const path = file.url.replace(/^npm:/, '');

          return readFile(require.resolve(path), 'utf8')
            .then((raw) => {
              callback(null, raw);
            })
            .catch((error) => {
              callback(error);
            });
        },
      },
    },
  });
};
