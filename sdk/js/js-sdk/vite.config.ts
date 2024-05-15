import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true, // 컴포넌트 타입 생성
    }),
    tsconfigPaths(), // 절대 경로 생성시 사용된다.
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'lib'), // 필요한 경우 프로젝트 구조에 맞게 수정
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'), // 진입점 파일 설정
      formats: ['es', 'cjs'], // CommonJS 형식으로 번들링
      fileName: 'index', // 번들 파일 이름 설정
    },
    rollupOptions: {
      // 라이브러리가 의존하는 외부 패키지들을 external로 설정
      external: ['react', 'react-dom'],
    },
    outDir: 'dist', // 빌드된 파일이 생성될 디렉토리
    emptyOutDir: true, // 빌드하기 전 outDir 비우기
  },
});
