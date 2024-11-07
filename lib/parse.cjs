'use strict';

const { readFile } = require('node:fs/promises');
const $refParser = require('@apidevtools/json-schema-ref-parser');

module.exports = function parse({ data, resourcePath, dereference = true }) {
  return $refParser[dereference ? 'dereference' : 'bundle'](
    resourcePath,
    data,
    {
      dereference: {
        circular: true,
      },
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
    },
  );
};
