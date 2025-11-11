import { readFile } from 'node:fs/promises';

import $refParser from '@apidevtools/json-schema-ref-parser';

import { fileURLToPath } from 'node:url';

export function parse({ data, resourcePath, dereference = true }) {
  const method = $refParser[dereference ? 'dereference' : 'bundle'];

  return method(resourcePath, data, {
    dereference: {
      circular: true,
    },
    resolve: {
      npm: {
        canRead: /^npm:/i,
        read(file, callback) {
          const path = file.url.replace(/^npm:/, '');
          const src = fileURLToPath(import.meta.resolve(path));

          return readFile(src, 'utf8')
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
}
