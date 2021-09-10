import semver from 'semver';
import { execSync } from 'child_process';

/**
 * Checks if current npm version can install peer
 * dependencies by yourself.
 */
export const checkNpmVersion = () => {
  const version = execSync('npm --version').toString().trim();

  return {
    version,
    needToInstallPeerDependencies: semver.gte('7.0.0', version),
  };
};
