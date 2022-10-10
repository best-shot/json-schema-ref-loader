import { fileURLToPath } from 'node:url';

import { runLoaders } from 'loader-runner';

export function run({ resource, loader }) {
  return new Promise((resolve, reject) => {
    runLoaders({ resource, loaders: [loader] }, (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

export function resolvePath(path, from) {
  return fileURLToPath(new URL(path, from));
}
