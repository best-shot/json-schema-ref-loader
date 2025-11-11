import { fileURLToPath } from 'node:url';
// @ts-expect-error -----------------
import concordance from 'concordance';
import { runLoaders } from 'loader-runner';
import { readFile } from 'node:fs';
import { load as yamlLoad } from 'js-yaml';

export function diff(a: object, b: object) {
  return concordance
    .diffDescriptors(concordance.describe(a), concordance.describe(b))
    .trim();
}

type Back = {
  input: object;
  result: object;
};

export function run({
  resource,
  loader,
  options,
}: {
  resource: string;
  loader: string;
  options?: Record<string, unknown>;
}): Promise<Back> {
  return new Promise<Back>((resolve, reject) => {
    runLoaders(
      {
        resource,
        loaders: [{ loader, options }],
        context: {
          getOptions: () => options,
        },
        readResource: (filename, callback) => readFile(filename, callback),
      },
      (error, result) => {
        if (error) {
          reject(error);
        }

        const temp = result.resourceBuffer?.toString() || '';

        resolve({
          input: yamlLoad(temp) as object,
          result: JSON.parse(result.result?.[0]?.toString() || 'null'),
        });
      },
    );
  });
}

export function resolvePath(path: string, from: string): string {
  return fileURLToPath(new URL(path, from));
}
