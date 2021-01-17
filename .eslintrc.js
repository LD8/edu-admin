module.exports = {
  root: true,
  env: {
    node: true
  },
  // 使用插件的编码规则
  extends: [
    // "eslint-plugin-vue": "^6.2.2"：效验 vue 项目中的 vue 文件：https://eslint.vuejs.org/
    'plugin:vue/essential',
    // "@vue/eslint-config-standard": "^5.1.2"：standard 效验规则（行尾不应有分号）
    '@vue/standard',
    // "@vue/eslint-config-typescript": "^5.0.2"：通过 ESLint 效验TS：https://github.com/vuejs/eslint-config-typescript#readme
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  // 自定义编码效验规则：https://cn.eslint.org/docs/rules
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: 1,
    // 配置 TS 效验规则：查询文档 https://github.com/vuejs/eslint-config-typescript#readme
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true
        }
      }
    ]
  }
}
