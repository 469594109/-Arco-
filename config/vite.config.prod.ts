import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';
import configArcoResolverPlugin from './plugin/arcoResolver';
import configStyleImportPlugin from './plugin/styleImport';
import configImageminPlugin from './plugin/imagemin';


export default mergeConfig(
  {
    base: './',
    mode: 'production',
    plugins: [
      configCompressPlugin('gzip'),
      configVisualizerPlugin(),
      configArcoResolverPlugin(),
      configStyleImportPlugin(),
      configImageminPlugin(),
    ],
    build: {
        outDir: '../work/yqb/yqb-web/src/main/resources/static/', // 指定输出路径
        assetsDir: 'assets', // 指定生成静态文件目录
        assetsInlineLimit: '4096', // 小于此阈值的导入或引用资源将内联为 base64 编码
        sourcemap: false,// 不输出.map 以减小体积
        minify: 'terser',// 混淆器，terser构建后文件体积更小
        terserOptions: {
            compress: {
                // warnings: false, // 若打包错误，则注释这行
                drop_debugger: true, // 清除 debugger 语句
                drop_console: true, // 清除console语句
                pure_funcs: ["console.log"],
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    arco: ['@arco-design/web-vue'],
                    chart: ['echarts', 'vue-echarts'],
                    vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
                },
            },
        },
        emptyOutDir: true,// 构建时清空该目录
        chunkSizeWarningLimit: 2000,
    },
  },
  baseConfig
);
