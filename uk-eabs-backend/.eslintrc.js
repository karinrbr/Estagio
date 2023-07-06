module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  plugins: ['nestjs', '@typescript-eslint', 'jest'],
  extends: [
    'plugin:nestjs/recommended', // Uses the recommended rules from @eslint-plugin-nestjs
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    'nestjs/use-validation-pipe': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
  },
};
