module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Disable rules that might cause CI failures
    'no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'no-use-before-define': 'warn'
  }
};