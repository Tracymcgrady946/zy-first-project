/**
 * 打包前检查 Node 版本（本项目使用 Node 23）
 * 需要 Node >= 18.0.0
 */
var raw = process.version.slice(1).split('.');
var major = parseInt(raw[0], 10) || 0;

var needMajor = 18;

if (major < needMajor) {
  console.error('\n\u274c 当前 Node 版本过低，无法打包。');
  console.error('   当前: ' + process.version);
  console.error('   需要: Node >= 18.0.0（本项目推荐使用 Node 23）');
  console.error('\n   使用 Node 23 打包：');
  console.error('   nvm use 23    # 若已安装 Node 23');
  console.error('   或: nvm install 23 && nvm use 23');
  console.error('   或: https://nodejs.org\n');
  process.exit(1);
}
