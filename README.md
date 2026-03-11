# PluginCore-React

多脚本容器 - `React` 版（参考 [`ClawX`](https://github.com/ValueCell-ai/ClawX)）

## 项目简介

PluginCore-React 是一个基于 **Electron + Vite + React** 的现代化桌面应用框架，提供安全、高效的 IPC 通信机制和跨平台构建能力。

## 技术栈

### 核心框架
- **React 19.2.4** - 最新版本的 React 框架
- **Electron 40.8.0** - 桌面应用开发框架
- **Vite 7.3.1** - 下一代前端构建工具

### UI 组件
- **Material-UI 7.3.9** - Material Design 组件库
- **Emotion** - CSS-in-JS 样式引擎

### 开发工具
- **TypeScript** - 类型安全的 JavaScript 超集
- **pnpm 10.31.0** - 快速、节省空间的包管理器

### 其他依赖
- **react-router-dom 7.13.1** - React 路由
- **i18next 25.8.14** - 国际化框架
- **electron-store 11.0.2** - 数据持久化存储
- **electron-updater 6.8.3** - 自动更新支持

## 环境要求

### Node.js 版本

| 操作系统 | Node.js 版本 | 说明 |
| -------- | ------------ | ---- |
| Windows  | `24.0.0`     | 推荐使用 nvm 管理版本 |
| macOS    | `20.x` 或更高 | 待测试 |
| Linux    | `20.x` 或更高 | 待测试 |

### 系统要求

- **Windows**: Windows 10/11 (64-bit)
- **macOS**: macOS 10.13+ (Intel/Apple Silicon)
- **Linux**: Ubuntu 18.04+ / Debian 9+ / Fedora 29+

## 快速开始

### 1. 安装依赖

```bash
# 首次安装（包含 Electron 二进制文件）
pnpm init
```

### 2. 开发模式

```bash
# 启动开发服务器（Vite + Electron 热重载）
pnpm dev
```

开发服务器将在 http://localhost:8100/ 启动，并自动打开 Electron 窗口。

### 3. 构建打包

```bash
# 构建并打包当前平台
pnpm build

# 仅构建 Vite（不打包 Electron）
pnpm build:vite
```

构建产物输出到 `release` 目录。

## 项目结构

```
PluginCore-React/
├── electron/
│   ├── main/           # Electron 主进程
│   │   ├── index.ts    # 主进程入口
│   │   └── api.ts      # IPC 处理器注册
│   └── preload/        # Electron 预加载脚本
│       └── index.ts    # 安全桥接渲染进程与主进程
├── src/                # React 源代码
│   ├── types/          # TypeScript 类型定义
│   ├── App.tsx         # 主应用组件
│   └── main.tsx        # React 入口文件
├── scripts/            # 构建脚本
│   └── after-pack.cjs  # 打包后钩子
├── resources/          # 应用资源（图标等）
├── dist/               # Vite 构建输出
├── dist-electron/      # Electron 编译输出
├── release/            # 打包输出目录
└── 配置文件
    ├── electron-builder.yml  # Electron Builder 配置
    ├── vite.config.ts        # Vite 配置
    ├── tsconfig.json         # TypeScript 配置
    └── .npmrc                # pnpm 配置
```

## 开发指南

### IPC 通信架构

项目采用安全的 IPC 通信模式：

1. **主进程** (`electron/main/`) - 处理系统级操作
2. **预加载脚本** (`electron/preload/`) - 暴露安全的 API 给渲染进程
3. **渲染进程** (`src/`) - React 应用，通过暴露的 API 与主进程通信

### 添加新的 IPC 接口

1. 在 `electron/main/api.ts` 中注册处理器
2. 在 `electron/preload/index.ts` 中暴露 API
3. 在 `src/types/electron.d.ts` 中添加类型定义
4. 在 React 组件中使用 `window.electronAPI` 调用

### 跨平台构建

配置位于 `electron-builder.yml`，支持：

- **Windows**: NSIS 安装程序 + 便携版
- **macOS**: DMG + ZIP
- **Linux**: AppImage + DEB

### 自定义图标

在 `resources/` 目录放置图标文件：

- `icon.ico` - Windows (256x256)
- `icon.icns` - macOS
- `icon.png` - Linux (512x512)

## 构建输出

### Windows (x64)

```
release/
├── pluginCore-1.0.0-win-x64.exe      # NSIS 安装程序
├── pluginCore-1.0.0-win-x64.exe.blockmap
└── win-unpacked/                     # 未打包版本（测试用）
```

## 注意事项

1. **Electron 安装**
   - 首次运行 `pnpm init` 会下载 Electron 二进制文件（约 138 MB）
   - 如遇安装失败，请手动运行：`node node_modules/.pnpm/electron@*/node_modules/electron/install.js`

2. **pnpm 配置**
   - 项目包含 `.npmrc` 配置文件，允许 Electron 的构建脚本
   - 不要删除此文件，否则 Electron 无法正确安装

3. **开发服务器**
   - Vite 开发服务器运行在 http://localhost:8100/
   - Electron 会自动加载开发服务器或生产构建

4. **代码签名**
   - 当前配置未启用代码签名
   - 生产环境需要配置证书进行签名

## 许可证

MIT License © 2026 CHEN
