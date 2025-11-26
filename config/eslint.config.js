import { createEslintConfig } from '@planttheidea/build-tools';

export default createEslintConfig({
  config: 'config',
  configs: [
    {
      rules: {
        '@typescript-eslint/prefer-for-of': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        'no-loss-of-precision': 'off',
      },
    },
  ],
  development: 'dev',
  react: false,
  source: 'src',
});
