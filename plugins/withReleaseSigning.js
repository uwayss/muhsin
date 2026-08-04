// plugins/withReleaseSigning.js
const { withAppBuildGradle, withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const DEFAULT_KEYSTORE_FILE = 'keystore.jks';

/**
 * Wires up release signing for a Continuous Native Generation project.
 *
 * The android directory is regenerated on every prebuild, so the upload keystore
 * and its signing config cannot live there permanently. This plugin re-applies
 * both each time prebuild runs:
 *
 *   1. Copies <projectRoot>/keystore.jks into android/app/.
 *   2. Rewrites the release build type to sign with it instead of the debug key
 *      that Expo's template hardcodes.
 *
 * Put keystore.jks in the project root when you want to build for Android. It is
 * gitignored and deliberately not tracked. Credentials come from .env (or
 * .env.local, which wins) - see .env.example.
 */

/**
 * Reads KEY=value pairs from .env and .env.local. Deliberately hand-rolled
 * rather than pulling in dotenv: this needs three values at prebuild time, and
 * Expo's own env loading targets EXPO_PUBLIC_* vars for the app bundle, which is
 * a different concern from build-time secrets.
 */
function readEnvFiles(projectRoot) {
  const values = {};

  for (const filename of ['.env', '.env.local']) {
    const filePath = path.join(projectRoot, filename);
    if (!fs.existsSync(filePath)) continue;

    for (const rawLine of fs.readFileSync(filePath, 'utf8').split('\n')) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      const separator = line.indexOf('=');
      if (separator === -1) continue;

      const key = line.slice(0, separator).trim();
      let value = line.slice(separator + 1).trim();

      const isQuoted =
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"));
      if (isQuoted) value = value.slice(1, -1);

      values[key] = value;
    }
  }

  return values;
}

function readSigningEnv(projectRoot) {
  const env = readEnvFiles(projectRoot);
  return {
    keystoreFile: env.KEYSTORE_FILE || DEFAULT_KEYSTORE_FILE,
    alias: env.KEYSTORE_ALIAS,
    storePassword: env.KEYSTORE_STORE_PASSWORD,
    keyPassword: env.KEYSTORE_KEY_PASSWORD,
  };
}

const withKeystoreCopy = (config) =>
  withDangerousMod(config, [
    'android',
    (config) => {
      const { projectRoot, platformProjectRoot } = config.modRequest;
      const { keystoreFile } = readSigningEnv(projectRoot);

      const source = path.join(projectRoot, keystoreFile);
      const destination = path.join(platformProjectRoot, 'app', keystoreFile);

      if (fs.existsSync(source)) {
        fs.copyFileSync(source, destination);
        console.log(`withReleaseSigning: copied ${keystoreFile} into android/app`);
      } else {
        console.warn(
          `withReleaseSigning: no ${keystoreFile} in the project root. ` +
            `Debug builds are unaffected, but a release build will not be signed with the upload key.`,
        );
      }

      return config;
    },
  ]);

const withReleaseSigningConfig = (config) =>
  withAppBuildGradle(config, (config) => {
    const { projectRoot } = config.modRequest;
    const { keystoreFile, alias, storePassword, keyPassword } = readSigningEnv(projectRoot);

    const keystoreExists = fs.existsSync(path.join(projectRoot, keystoreFile));
    const hasCredentials = Boolean(alias && storePassword && keyPassword);

    // A keystore with no credentials is a misconfiguration worth failing on. The
    // alternative is a release build that is silently signed with the debug key
    // and only rejected once it reaches Play.
    if (keystoreExists && !hasCredentials) {
      throw new Error(
        `withReleaseSigning: found ${keystoreFile} but KEYSTORE_ALIAS, ` +
          `KEYSTORE_STORE_PASSWORD and KEYSTORE_KEY_PASSWORD are not all set. ` +
          `Copy .env.example to .env and fill them in.`,
      );
    }

    if (!hasCredentials) return config;

    let contents = config.modResults.contents;

    if (contents.includes('signingConfigs.release')) return config;

    // Point the release build type at the upload key. Ordered before the
    // signingConfigs insertion below so the anchor is unambiguous: at this point
    // the only `release {` in the file is the build type.
    contents = contents.replace(
      /(release\s*\{[^}]*?)signingConfig signingConfigs\.debug/,
      '$1signingConfig signingConfigs.release',
    );

    contents = contents.replace(
      /signingConfigs\s*\{/,
      `signingConfigs {
        release {
            storeFile file('${keystoreFile}')
            storePassword '${storePassword}'
            keyAlias '${alias}'
            keyPassword '${keyPassword}'
        }`,
    );

    config.modResults.contents = contents;
    return config;
  });

module.exports = function withReleaseSigning(config) {
  return withReleaseSigningConfig(withKeystoreCopy(config));
};
