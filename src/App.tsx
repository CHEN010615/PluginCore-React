import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Alert } from '@mui/material'
import { Computer, Storage, Info } from '@mui/icons-material'

function App() {
  const [osInfo, setOsInfo] = useState<{ platform: string; arch: string; version: string; release: string; type: string } | null>(null)
  const [performanceInfo, setPerformanceInfo] = useState<{ hostname: string; cpu: { model: string; speed: number; cores: number; usage: string[] }; memory: { total: number; free: number; used: number; usagePercent: string }; network: { interfaces: string[] }; uptime: number; loadavg: number[] } | null>(null)
  const [nodeInfo, setNodeInfo] = useState<{ version: string; electron: string; type: string } | null>(null)
  const [loading, setLoading] = useState<{ os: boolean; node: boolean; performance: boolean }>({ os: false, node: false, performance: false })
  const [error, setError] = useState<{ os: string | null; node: string | null; performance: string | null }>({ os: null, node: null, performance: null })

  const handleGetOSInfo = async () => {
    setLoading(prev => ({ ...prev, os: true }))
    setError(prev => ({ ...prev, os: null }))
    try {
      const info = await window.electronAPI.invoke('system:os')
      setOsInfo(info as typeof osInfo)
    } catch (err) {
      setError(prev => ({ ...prev, os: '获取操作系统信息失败' }))
    } finally {
      setLoading(prev => ({ ...prev, os: false }))
    }
  }

  const handleGetPerformanceInfo = async () => {
    setLoading(prev => ({ ...prev, node: true }))
    setError(prev => ({ ...prev, node: null }))
    try {
      const info = await window.electronAPI.invoke('system:performance')
      setPerformanceInfo(info as typeof performanceInfo)
    } catch (err) {
      setError(prev => ({ ...prev, performance: '获取系统性能信息失败' }))
    } finally {
      setLoading(prev => ({ ...prev, node: false }))
    }
  }

  const handleGetNodeInfo = async () => {
    setLoading(prev => ({ ...prev, node: true }))
    setError(prev => ({ ...prev, node: null }))
    try {
      const info = await window.electronAPI.invoke('system:node')
      setNodeInfo(info as typeof nodeInfo)
    } catch (err) {
      setError(prev => ({ ...prev, node: '获取 Node.js 信息失败' }))
    } finally {
      setLoading(prev => ({ ...prev, node: false }))
    }
  }

  useEffect(() => {
    // 初始化时获取系统信息
    handleGetOSInfo()
    handleGetPerformanceInfo()
    handleGetNodeInfo()
  }, [])

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* 标题区域 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
          PAL-HUB
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Electron + React 桌面应用框架
        </Typography>
      </Box>

      {/* 主要功能按钮 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 0 }} gutterBottom>
          系统信息查询
        </Typography>
      </Paper>

      {/* 信息显示区域 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* OS 信息卡片 */}
        <Paper 
            sx={{ 
              p: 3, 
              bgcolor: '#e3f2fd',
              border: '1px solid',
              borderColor: '#90caf9'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Computer sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6" fontWeight="bold">
                操作系统
              </Typography>
            </Box>
            
            {error.os && (
              <Alert severity="error" sx={{ mb: 2 }}>{error.os}</Alert>
            )}
            
            {osInfo ? (
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>平台:</strong> {osInfo.platform}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>架构:</strong> {osInfo.arch}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>版本:</strong> {osInfo.version}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>发行版:</strong> {osInfo.release}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>类型:</strong> {osInfo.type}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                点击按钮获取操作系统信息
              </Typography>
            )}
          </Paper>

        {/* 系统性能卡片 */}
        <Paper
          sx={{
            p: 3,
            bgcolor: '#f3e5f5',
            border: '1px solid',
            borderColor: '#ce93d8'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Storage sx={{ mr: 1, color: '#7b1fa2' }} />
            <Typography variant="h6" fontWeight="bold">
              系统信息
            </Typography>
          </Box>

          {error.performance && (
            <Alert severity="error" sx={{ mb: 2 }}>{error.performance}</Alert>
          )}

          {performanceInfo ? (
            <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>主机名:</strong> {performanceInfo.hostname}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>CPU 型号:</strong> {performanceInfo.cpu.model}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>CPU 频率:</strong> {performanceInfo.cpu.speed} MHz
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>CPU 核心数:</strong> {performanceInfo.cpu.cores}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>内存总计:</strong> {(performanceInfo.memory.total / 1024 / 1024 / 1024).toFixed(2)} GB
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>内存可用:</strong> {(performanceInfo.memory.free / 1024 / 1024 / 1024).toFixed(2)} GB
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>内存已用:</strong> {(performanceInfo.memory.used / 1024 / 1024 / 1024).toFixed(2)} GB
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>内存使用率:</strong> {performanceInfo.memory.usagePercent}%
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>系统运行时间:</strong> {(performanceInfo.uptime / 3600).toFixed(2)} 小时
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>系统负载:</strong> {performanceInfo.loadavg.map(l => l.toFixed(2)).join(' / ')}
              </Typography>
              <Typography variant="body2">
                <strong>网络接口:</strong> {performanceInfo.network.interfaces.join(', ')}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              点击按钮获取系统性能信息
            </Typography>
          )}
        </Paper>
      </Box>

      {/* 底部状态栏 */}
      <Paper 
        sx={{ 
          mt: 3, 
          p: 2, 
          bgcolor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info color="action" />
          <Typography variant="body2">
            <strong>Node:</strong> {nodeInfo?.version || '未获取'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info color="action" />
          <Typography variant="body2">
            <strong>Electron:</strong> {nodeInfo?.electron || '未获取'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default App
