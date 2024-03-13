// eslint-disable-next-line no-undef
module.exports = {
  parser: "@typescript-eslint/parser",

  plugins: ["@typescript-eslint"],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],

  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },

  overrides: [
    {
      files: ["src/test/**"],
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
      env: {
        "jest/globals": true,
      },
    },
  ],
};
