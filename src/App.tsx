import { useState, useEffect } from 'react'
import { Box, Typography, Button, Paper, Alert, Chip, Divider, Stack } from '@mui/material'
import { Computer, Storage, Notifications, Info } from '@mui/icons-material'

function App() {
  const [osInfo, setOsInfo] = useState<{ platform: string; version: string; arch: string } | null>(null)
  const [nodeInfo, setNodeInfo] = useState<{ version: string; nodeVersion: string; v8Version: string; uvVersion: string } | null>(null)
  const [notification, setNotification] = useState<string>('')
  const [loading, setLoading] = useState<{ os: boolean; node: boolean }>({ os: false, node: false })
  const [error, setError] = useState<{ os: string | null; node: string | null }>({ os: null, node: null })

  const handleGetOSInfo = async () => {
    setLoading(prev => ({ ...prev, os: true }))
    setError(prev => ({ ...prev, os: null }))
    try {
      const info = await window.electronAPI.system.os.getInfo()
      setOsInfo(info)
    } catch (err) {
      setError(prev => ({ ...prev, os: '获取操作系统信息失败' }))
    } finally {
      setLoading(prev => ({ ...prev, os: false }))
    }
  }

  const handleGetNodeInfo = async () => {
    setLoading(prev => ({ ...prev, node: true }))
    setError(prev => ({ ...prev, node: null }))
    try {
      const info = await window.electronAPI.system.node.getInfo()
      setNodeInfo(info)
    } catch (err) {
      setError(prev => ({ ...prev, node: '获取 Node.js 信息失败' }))
    } finally {
      setLoading(prev => ({ ...prev, node: false }))
    }
  }

  useEffect(() => {
    const unsubscribe = window.electronAPI.on('system:notification', (data) => {
      setNotification(`通知：${JSON.stringify(data)}`)
    })

    return () => {
      unsubscribe?.()
    }
  }, [])

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* 标题区域 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
          PluginCore-React
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Electron + React 桌面应用框架
        </Typography>
      </Box>

      {/* 通知区域 */}
      {notification && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          icon={<Notifications />}
          onClose={() => setNotification('')}
        >
          {notification}
        </Alert>
      )}

      {/* 主要功能按钮 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          系统信息查询
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            onClick={handleGetOSInfo}
            loading={loading.os}
            startIcon={<Computer />}
            sx={{ minWidth: 160 }}
          >
            获取 OS 信息
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleGetNodeInfo}
            loading={loading.node}
            startIcon={<Storage />}
            sx={{ minWidth: 160 }}
          >
            获取 Node 信息
          </Button>
        </Stack>
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
                操作系统信息
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
                  <strong>版本:</strong> {osInfo.version}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>架构:</strong> {osInfo.arch}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                点击按钮获取操作系统信息
              </Typography>
            )}
          </Paper>

        {/* Node.js 信息卡片 */}
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
              Node.js 信息
            </Typography>
          </Box>

          {error.node && (
            <Alert severity="error" sx={{ mb: 2 }}>{error.node}</Alert>
          )}

          {nodeInfo ? (
            <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>版本:</strong> {nodeInfo.version}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Node.js:</strong> {nodeInfo.nodeVersion}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>V8:</strong> {nodeInfo.v8Version}
              </Typography>
              <Typography variant="body2">
                <strong>Libuv:</strong> {nodeInfo.uvVersion}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              点击按钮获取 Node.js 信息
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
            <strong>当前平台:</strong> {window.electronAPI.platform}
          </Typography>
        </Box>
        <Chip
          label={window.electronAPI.isDev ? '开发模式' : '生产模式'}
          color={window.electronAPI.isDev ? 'warning' : 'success'}
          size="small"
        />
      </Paper>
    </Box>
  )
}

export default App
