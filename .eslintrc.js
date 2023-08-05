module.exports = {
    root: true,
    parser: 'vue-eslint-parser',

    env: {
        node: true,
        //jquery: true,
        browser: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/recommended'
    ],
    parserOptions: {
        parser: '@babel/eslint-parser',
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': 'off',
        'no-cond-assign': 'off',
        'no-empty': 'off',
        'no-useless-escape': 'off',
        'no-undef': 'off',
        'no-prototype-builtins': 'off',
        'no-inner-declaration': 'off',
        'no-shadow-restricted-names': 'off',
        'no-self-assign': 'off',
        'no-control-regex': 'off',
        'es/no-object-getownpropertynames': 'off',
        'vue/no-async-in-computed-properties': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/singleline-html-element-content-newline': 'off'
    },
    ignorePatterns: ['src/assets/*', 'src/components/*', 'src/views/*'],
}
