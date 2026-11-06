import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/**
 * Guards from implementation.md §17.8. They are lint rules, not conventions,
 * so design drift and motion drift fail CI instead of landing in a review.
 */
const RAW_HEX = String.raw`#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-zA-Z])`;
const RAW_DURATION = String.raw`^\s*\d+(?:\.\d+)?m?s\s*$`;
const RAW_EASING = String.raw`cubic-bezier\(|^ease(?:-in|-out|-in-out)?$|^linear$`;
// Pictographic ranges only: Indic and Latin text must stay legal.
const EMOJI = String.raw`[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]`;

const designGuards = {
  'no-restricted-syntax': [
    'error',
    {
      selector: `Literal[value=/${RAW_HEX}/]`,
      message:
        'No raw hex colours in components. Use a token from apps/web/src/styles/tokens.css (implementation.md §12.2).',
    },
    {
      selector: `TemplateElement[value.raw=/${RAW_HEX}/]`,
      message:
        'No raw hex colours in components. Use a token from apps/web/src/styles/tokens.css (implementation.md §12.2).',
    },
    {
      selector: `Literal[value=/${RAW_DURATION}/]`,
      message:
        'No inline durations. Use a token from apps/web/src/styles/motion.css or a spring from ui/motion/presets.ts (implementation.md §12.8).',
    },
    {
      selector: `Literal[value=/${RAW_EASING}/]`,
      message:
        'No inline easing curves. Use a token from apps/web/src/styles/motion.css (implementation.md §12.8).',
    },
    {
      selector: `Literal[value=/${EMOJI}/u]`,
      message:
        'No emoji in the UI. Use the icon set in apps/web/src/ui/icons (implementation.md §12.7).',
    },
  ],
};

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/dev-dist/**',
      '**/coverage/**',
      'design/**',
      'playwright-report/**',
      'test-results/**',
      '.venv/**',
      'apps/worker/**',
      'supabase/.temp/**',
      // Deno runtime with npm: specifiers; checked by `deno lint` in CI instead.
      'supabase/functions/**',
    ],
  },

  js.configs.recommended,
  tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Web app: browser globals, React rules and the design guards.
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['apps/web/src/ui/**/*.{ts,tsx}', 'apps/web/src/features/**/*.{ts,tsx}'],
    rules: designGuards,
  },

  // Config, scripts and tests run in Node and may log.
  {
    files: [
      '**/*.config.{ts,js,mjs}',
      'scripts/**/*.mjs',
      'e2e/**/*.ts',
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
    rules: {
      'no-console': 'off',
    },
  },
);
