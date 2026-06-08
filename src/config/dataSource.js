/**
 * 数据源开关：控制页面数据来自后端 API 还是前端硬编码
 * - true: 使用后端服务 (my_server)
 * - false: 使用前端 mock 数据
 *
 * 优先级（从高到低）：
 * 1. URL 参数 ?mock=1 强制使用 mock
 * 2. localStorage.VITE_USE_MOCK=1 强制使用 mock
 * 3. 环境变量 VITE_USE_BACKEND=false
 *
 * 注意：修改 .env 后需重启 dev server
 */
function getUseBackend() {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    if (params.get('mock') === '1') return false
    if (localStorage.getItem('VITE_USE_MOCK') === '1') return false
  }
  const envVal = import.meta.env.VITE_USE_BACKEND
  return String(envVal).toLowerCase() !== 'false'
}

export const useBackend = getUseBackend()
