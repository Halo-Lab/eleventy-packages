import { join } from 'path';
import { promises } from 'fs';

const envContent = `
HOST=http://localhost:3000
# Uncomment line below to get debug messages from Eleventy
# and plugins.
# DEBUG=*
`;

export const generateEnvFile = (cwd: string) =>
  promises.writeFile(join(cwd, '.env'), envContent, {
    encoding: 'utf-8',
  });
