const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  globals: {
    describe: true,
    it: true,
    expect: true,
    beforeEach: true,
    NodeJS: true,
  },
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'plugin:prettier/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue'],
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['vue', '@typescript-eslint', 'simple-import-sort', 'prettier'],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // eslint (http://eslint.cn/docs/rules)
    'no-var': ['error'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-debugger': ['error'],
    'no-extra-bind': ['error'],

    // typescript (http://typescript-eslint.io/rules)
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/class-literal-property-style': ['error', 'getters'],
    '@typescript-eslint/no-empty-function': ['off'],
    '@typescript-eslint/no-require-imports': ['off'],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],

    // vue (http://eslint.vuejs.org/rules)
    'vue/one-component-per-file': ['error'],
    'vue/require-default-prop': ['off'],
    'vue/no-mutating-props': ['off'],
    'vue/multi-word-component-names': ['off'],
    'vue/padding-line-between-blocks': ['error'],
    'vue/require-component-is': ['error'],
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/component-options-name-casing': ['error', 'PascalCase'],
    'vue/no-reserved-component-names': ['error', { disallowVue3BuiltInComponents: true }],
    'vue/component-tags-order': ['error', { order: ['script:not([setup])', 'script[setup]', 'template', 'style'] }],
    'vue/block-lang': ['error', { script: { lang: 'ts' } }],
    'vue/no-template-shadow': ['off'],
    'vue/attributes-order': [
      'error',
      {
        order: [
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'DEFINITION',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
      },
    ],
    'vue/order-in-components': [
      'error',
      {
        order: [
          'name',
          ['components', 'directives'],
          ['mixins', 'provide', 'inject'],
          'props',
          'emits',
          'data',
          'computed',
          'watch',
          'LIFECYCLE_HOOKS',
          'methods',
          ['template', 'render'],
          'renderError',
        ],
      },
    ],
    'vue/valid-attribute-name': ['off'],
    'vue/no-v-html': ['error'],
    'vue/no-unused-refs': ['error'],
    'vue/no-unused-vars': ['error'],
    'vue/no-undef-properties': ['error'],
    'vue/no-lone-template': ['error'],
    'vue/v-on-function-call': ['error'],
    'vue/v-on-event-hyphenation': ['error', 'always', { autofix: true }],

    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['./polyfills'],
          // Node.js builtins. You could also generate this regex if you use a `.js` config.
          // For example: `^(${require("module").builtinModules.join("|")})(/|$)`
          [
            '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
          ],
          // Packages. `react|vue` related packages come first.
          ['^(react|vue|vite)', '^@?\\w'],
          ['^(@tmagic)(/.*|$)'],
          // Internal packages.
          ['^(@|@editor)(/.*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$'],
        ],
      },
    ],

    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
        semi: true,
        arrowParens: 'always',
        bracketSpacing: true,
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        endOfLine: 'auto',
        vueIndentScriptAndStyle: false,
        vueIndentHTML: false,
      },
    ],
  },
});
