// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
//   { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
//   tseslint.configs.recommended,
// ]);

// .eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import * as importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // 0) 무시할 경로
  { ignores: ['dist/**', 'node_modules/**'] },

  // 1) 자바스크립트 추천 규칙
  js.configs.recommended,

  // 2) 타입스크립트 추천 규칙 (flat은 전개가 필요 없음: 배열 요소로 넣으면 됩니다)
  ...tseslint.configs.recommended,

  // 3) 우리 프로젝트 공통 설정
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // 백엔드(CommonJS) 기준
      globals: globals.node, // ✅ Node 환경
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': ['warn', { 'newlines-between': 'always' }],
      // 필요 시 팀 취향에 따라 추가:
      // '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // 4) Prettier와 충돌나는 규칙 비활성화 (항상 맨 끝에)
  eslintConfigPrettier,
];
