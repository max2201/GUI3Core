/* eslint-env node */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'plugin:prettier/recommended',
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'at-rule-no-unknown': [true, { ignoreAtRules: ['tailwind', 'apply'] }],
    'function-no-unknown': [true, { ignoreFunctions: ['theme'] }],
    'declaration-empty-line-before': null,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'import-notation': null,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
  },
}
