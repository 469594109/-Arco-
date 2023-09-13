import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
        // https: true,
        open: false,
        Local: 'localhost',
        // host: '192.168.2.21',
        fs: {
            strict: true,
        },
        proxy: {
            "/yqb": {
                // target: "http://localhost:8000", // 自己笔记本本地服务 - 测资源
                target: "http://localhost:8083", // 自己笔记本本地服务
                // target: "http://localhost:18886", // 自己笔记本本地服务
                changeOrigin: true,
                rewrite: (path) => {
                    return path.replace(/^\/yqb/, "/yqb");
                },
            },
        },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
);
