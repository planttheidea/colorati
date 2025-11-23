import { createEslintConfig } from '@planttheidea/build-tools';

export default createEslintConfig({
  config: 'config',
  configs: [
    {
      rules: {
        '@typescript-eslint/restrict-template-expressions': 'off'
      }
    }
  ]
  development: 'dev',
  react: false,
  source: 'src',
});
