module.exports = {
  "plugins": ["react"],
  "extends": ["semistandard"],
  "env": {
    "es6": true
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "impliedStrict": true,
      "experimentalObjectRestSpread": true,
      "jsx": true
    }
  }
}