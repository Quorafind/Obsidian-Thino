module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["react", "@typescript-eslint", "prettier"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-unused-vars": [2, { args: "all", argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-empty-interface": ["off"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-namespace": "off",
  },
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
};
