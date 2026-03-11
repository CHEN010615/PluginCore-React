/**
 * After Pack Hook
 * 在打包完成后执行的脚本
 * @param {Object} context - 上下文对象
 * @param {string} context.appOutDir - 输出目录
 * @param {string} context.outDir - 构建输出目录
 * @param {string} context.arch - 架构
 * @param {Object} context.packager - 打包器实例
 */
async function afterPack(context) {
  const { appOutDir, outDir, arch, packager } = context;
  
  // 在这里添加自定义的打包后处理逻辑
  // 例如：
  // - 复制额外文件
  // - 修改配置文件
  // - 签名
  // - 清理文件等
  
  console.log(`After pack completed for ${arch} architecture`);
  console.log(`App output directory: ${appOutDir}`);
  console.log(`Build output directory: ${outDir}`);
}

module.exports = afterPack;
