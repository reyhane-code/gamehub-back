import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
  return yaml.load(
    readFileSync(
      join(process.cwd(), `./src/config/env.stage.dev.yaml`),
      'utf8',
    ),
  ) as Record<string, any>;
};
