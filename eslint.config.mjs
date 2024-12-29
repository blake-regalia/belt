import elite from '@blake.regalia/eslint-config-elite';
debugger;
export default [
	...elite,
	{
		languageOptions: {
			 ecmaVersion: 2022,
			 sourceType: 'module',
			//  globals: {
			// 	  ...globals.browser,
			// 	  ...globals.node,
			// 	  chrome: 'readonly',
			//  },
			//  parser: tseslint_parser,
			 parserOptions: {
				  tsconfigRootDir: import.meta.dirname,
				  project: 'tsconfig.json',
			 },
		},
		ignores: [
			'dist',
			'node_modules',
			'submodules',
			'eslint.config.mjs',
		],
	}
];
