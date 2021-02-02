module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  rules: {
    'vue/no-use-v-if-with-v-for': 'off',
    'max-len': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'no-undef': 'off',
    'no-restricted-syntax': 'off',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: require.resolve('@vue/cli-service/webpack.config.js'),
      },
    },
  },
};
