# 全球运载火箭及发动机查询系统

这是一个现代化的、基于 React 和 Node.js 开发的运载火箭与发动机数据库系统。系统采用 Apple 风格的 UI 设计，支持多维度筛选、详细参数对比以及高清图片展示。

## 🚀 核心功能

- **火箭数据库**：收录全球主流运载火箭，支持按国家、厂商、运力、燃料类型、可回收性等筛选。
- **发动机引擎库**：收录 18+ 款主流液体火箭发动机，包含循环方式、推力、比冲等关键参数。
- **智能关联**：自动关联发动机与其驱动的火箭型号（例如：Raptor 2 关联 Starship）。
- **交互体验**：支持多图浏览、大图缩放（Lightbox）、以及全屏详情模态框。
- **静态化支持**：支持将数据库数据导出为静态 JSON，实现无后端的前端独立部署。

## 📂 目录结构规范

- `client/`: 前端 React 源码 (Vite)
  - `public/images/rockets/`: 火箭图片存放处
  - `public/images/engines/`: 发动机图片存放处
  - `src/data/`: 导出的静态 JSON 数据
- `server/`: 后端 API 与 数据管理脚本
  - `prisma/`: 数据库模型定义 (SQLite)
  - `seed.js`: 火箭数据种子
  - `seed_engines_manual.js`: 发动机数据种子
  - `export_static.js`: 静态数据导出脚本 (DB -> JSON)
- `pic/`: 原始图片素材库 (用于开发同步)

## 🛠️ 快速启动

### 1. 环境准备
确保已安装 Node.js (v18+)。

### 2. 初始化数据库 (首次运行)
```bash
cd server
npm install
npx prisma db push
npm run seed
```

### 3. 同步图片并导出数据
将图片放入 `pic/rocket_pic` 和 `pic/engine_pic` 后，运行：
```bash
cd server
# 将图片同步到前端 public 目录
# 目前手动操作或使用 copy 命令
# 导出数据到静态 JSON
npm run export
```

### 4. 运行应用
```bash
# 根目录下运行 (Windows)
start.bat

# 或者手动启动
cd client
npm run dev
```

## 📸 图片命名规范

- **精确匹配**：图片文件名应与数据库中的 `name` 字段一致。
- **多图支持**：支持 `型号(2).jpg`, `型号(3).png` 等格式，系统会自动识别为图集。
- **分类存放**：
  - 火箭图片：`client/public/images/rockets/`
  - 发动机图片：`client/public/images/engines/`

## 📄 开源协议
MIT License