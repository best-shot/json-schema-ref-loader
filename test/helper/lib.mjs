import { fileURLToPath } from 'node:url';

import concordance from 'concordance';
import { runLoaders } from 'loader-runner';

export function diff(a, b) {
  return concordance
    .diffDescriptors(concordance.describe(a), concordance.describe(b))
    .trim();
}

export function run({ resource, loader, options }) {
  return new Promise((resolve, reject) => {
    runLoaders(
      {
        resource,
        loaders: [{ loader, options }],
        context: {
          getOptions: () => options,
        },
      },
      (error, result) => {
        if (error) {
          reject(error);
        }

        const {
          resourceBuffer,
          result: [final],
        } = result;

        resolve({
          input: JSON.parse(resourceBuffer),
          result: JSON.parse(final),
        });
      },
    );
  });
}

export function resolvePath(path, from) {
  return fileURLToPath(new URL(path, from));
}
