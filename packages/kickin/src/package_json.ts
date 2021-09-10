import { promises } from 'fs';
import { sep, join } from 'path';

import chalk from 'chalk';
import { sequentially } from '@fluss/core';

import { progress } from './progress';
import { startProcess } from './spinner';
import { TOMATO_COLOR } from './colors';
import { checkNpmVersion } from './check_npm_version';

const generatePackageJson = async (cwd: string) => {
  const directories = cwd.split(sep);
  const lastDirectory = directories[directories.length - 1];

  const spinner = startProcess(
    `Initializing ${chalk.bold.yellow('package.json')}.`,
  );

  return promises
    .writeFile(
      join(cwd, 'package.json'),
      JSON.stringify(
        {
          name: lastDirectory,
          version: '0.1.0',
          private: true,
          scripts: {
            clean: 'rimraf build',
            build: 'NODE_ENV=production eleventy build',
            start: 'eleventy --serve --port=3000',
            prestart: 'npm run clean',
            prebuild: 'npm run clean',
            serve:
              'http-server build --port 3000 -b --ssl --key certs/key.pem --cert certs/cert.pem',
            precerts: 'mkdirp certs',
            certs:
              'mkcert -key-file certs/key.pem -cert-file certs/cert.pem localhost 127.0.0.1',
          },
          browserslist: ['> 0.5%', 'last 4 version', 'not dead'],
        },
        null,
        2,
      ),
      {
        encoding: 'utf-8',
      },
    )
    .then(
      () => spinner.succeed(`${chalk.bold.yellow('package.json')} is created.`),
      (error) => spinner.fail(error),
    );
};

const dependencies = async (cwd: string) => {
  const spinner = startProcess('Installing dependencies...');

  return progress(
    cwd,
    [
      'svgo',
      'dotenv',
      'mkdirp',
      'rimraf',
      'postcss-url',
      'http-server',
      'html-minifier',
      '@11ty/eleventy',
      '@11ty/eleventy-img',
      'eleventy-plugin-workbox',
      'eleventy-plugin-styles',
      'eleventy-plugin-scripts',
      'eleventy-plugin-compress',
      'eleventy-shortcode-image',
      'eleventy-plugin-pwa-icons',
      '@quasibit/eleventy-plugin-sitemap',
    ],
    spinner,
  ).then(
    () => spinner.succeed('Dependencies are installed.'),
    (error: Error) => spinner.fail(error.toString()),
  );
};

/** Installs peer dependencies if npm version is 6 and below. */
const peerDependencies = async (cwd: string) => {
  const { version, needToInstallPeerDependencies } = checkNpmVersion();

  if (needToInstallPeerDependencies) {
    console.log();
    console.log(
      ` ${chalk.blue('>')} Your version of ${chalk.gray(
        'npm',
      )} is ${chalk.bold.hex(TOMATO_COLOR)(
        version,
      )}, so we should also handle peer dependencies.`,
    );
    console.log();

    const spinner = startProcess('Installing peer dependencies...');

    return progress(
      cwd,
      [
        'sass',
        'chalk',
        'cssnano',
        'postcss',
        'esbuild',
        'autoprefixer',
        'browserslist',
        'workbox-build',
        'pwa-asset-generator',
        '@fullhuman/postcss-purgecss',
      ],
      spinner,
    ).then(
      () => spinner.succeed('Peer dependencies are installed.'),
      (error: Error) => spinner.fail(error.toString()),
    );
  }
};

export const createPackageJson: (cwd: string) => Promise<readonly any[]> =
  sequentially(generatePackageJson, dependencies, peerDependencies);
