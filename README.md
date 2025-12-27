# Global Launch Vehicle Database (全球运载火箭全息数据库)

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB) ![Node](https://img.shields.io/badge/backend-Node.js%20%2B%20Prisma-339933) ![Style](https://img.shields.io/badge/style-Apple%20Design-000000)

一个现代化、高性能的全球运载火箭信息查询系统。采用 Apple 官网风格的 UI 设计，提供详尽的火箭物理规格、动力参数、运载能力及回收技术解析。支持中英文双语界面。

## ✨ 核心特性 (Features)

*   **全息数据详情**: 收录全球主流火箭（长征系列、SpaceX、ULA、Ariane 等）的 30+ 项硬核参数，包括多级发动机配置、各轨道运力及物理尺寸。
*   **Apple 风格 UI**: 极简设计，大字号排版，磨砂玻璃特效，配合平滑的交互动画。
*   **多维级联筛选**:
    *   支持按 **国家/地区** -> **研制单位** 的级联筛选（智能防错）。
    *   支持按 **LEO 运力范围** (0-160t) 滑块筛选。
    *   支持按 **燃料类型**、**服役状态**、**级数** 精确过滤。
*   **沉浸式画廊**: 支持多角度图片展示，集成横向滚动缩略图与 Lightbox 大图查看模式。
*   **结果目录**: 侧边栏集成实时结果列表，支持快速导航。
*   **混合架构**: 
    *   **开发态**: 使用 Node.js + SQLite 管理数据。
    *   **运行态**: 编译为纯静态站点 (JSON + React)，无需后端即可运行，完美支持 GitHub Pages。

## 🛠 技术栈 (Tech Stack)

*   **Frontend**: React 18, Vite, Material UI (MUI v5)
*   **Backend (Data Management)**: Node.js, Express.js
*   **Database**: SQLite, Prisma ORM
*   **Tools**: PowerShell Scripts (`start.bat`), GitHub Actions (GH-Pages)

## 🚀 快速开始 (Getting Started)

### 环境要求
*   Node.js v18+
*   npm

### 方式一：一键启动 (推荐)
本项目内置了 Windows 启动脚本。双击根目录下的 **`start.bat`** 即可自动启动前端服务。
访问地址: `http://localhost:5173`

### 方式二：手动启动
```powershell
# 1. 安装前端依赖
cd client
npm install

# 2. 启动前端 (静态模式)
npm run dev
```

---

## 💾 数据维护与更新 (Data Workflow)

本项目采用**“后端管理数据，前端静态展示”**的模式。如果您需要添加新火箭或修改数据，请遵循以下流程：

### 1. 修改数据源
编辑 `server/seed.js` 文件。这里包含了所有火箭的 JSON 源数据。

### 2. 更新数据库
在 `server` 目录下运行：
```powershell
cd server
npm install  # 初次运行需要
npx prisma db push
npm run seed
```

### 3. 关联本地图片
将新图片放入 `pic` 文件夹（文件名需包含火箭型号），然后运行：
```powershell
node link_images.js
```
*该脚本会自动扫描图片并更新数据库中的 `imageUrl` 字段。*

### 4. 导出静态数据 (关键步骤)
为了让前端（静态版）获取最新数据，必须将数据库内容导出为 JSON：
```powershell
node export_static.js
```
*此命令会生成 `client/src/data/rockets.json`，前端页面将立即更新。*

---

## 📦 部署 (Deployment)

本项目已配置好 **GitHub Pages** 的自动化部署脚本。

1.  **提交代码**: 确保所有改动已 commit 并 push 到远程仓库。
2.  **执行部署**:
    ```powershell
    cd client
    npm run deploy
    ```
    *脚本会自动执行 `vite build` 打包项目，并将 `dist` 目录推送到 `gh-pages` 分支。*

## 📂 项目结构 (Structure)

```text
launch_vehicle_query_system/
├── client/                 # 前端项目
│   ├── public/images/      # 静态图片资源 (由 pic/ 复制而来)
│   ├── src/
│   │   ├── data/           # rockets.json (静态数据源)
│   │   ├── App.jsx         # 主应用逻辑
│   │   └── theme.js        # MUI 主题配置
│   └── vite.config.js      # Vite 配置
├── server/                 # 后端项目 (数据管理)
│   ├── prisma/             # 数据库 Schema
│   ├── seed.js             # 数据填充脚本
│   ├── link_images.js      # 图片关联脚本
│   └── export_static.js    # 静态化导出脚本
├── pic/                    # 原始图片素材库
├── doc/                    # 项目文档
└── start.bat               # Windows 启动脚本
```

## 📄 许可证 (License)

MIT License.
