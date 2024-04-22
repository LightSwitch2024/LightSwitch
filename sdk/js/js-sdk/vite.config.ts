import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 필요한 경우 프로젝트 구조에 맞게 수정
    },
  },
  build: {
    outDir: 'dist', // 빌드된 파일이 생성될 디렉토리
    emptyOutDir: true, // 빌드하기 전 outDir 비우기
  },
});
