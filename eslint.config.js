const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  //TODO: Make prettier only give warnings not errors
  {
    ignores: ["dist/*", "node_modules/*", "/.expo"],
  },
]);
