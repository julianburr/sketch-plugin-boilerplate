module.exports = {
  plugins: ['react'],
  extends: [
    'semistandard',
    'plugin:react/recommended'
  ],
  env: {
    es6: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      impliedStrict: true,
      experimentalObjectRestSpread: true,
      jsx: true
    }
  },
  rules: {
    semi: [2, "never"],
    "eol-last": 0,
    "space-before-function-paren": ["error", "never"],
    "react/prop-types": 0
  }
}