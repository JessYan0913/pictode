module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'update', 'fix', 'refactor', 'style', 'docs', 'chore', 'build', 'test']],
  },
};
