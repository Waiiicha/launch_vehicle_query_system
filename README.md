# 全球运载火箭及发动机查询系统

这是一个现代化的、基于 React 和 Node.js 开发的运载火箭与发动机数据库系统。系统采用 Apple 风格的 UI 设计，支持多维度筛选、详细参数对比以及高清图片展示。

## 🚀 核心功能

- **火箭数据库**：收录全球主流运载火箭，支持按国家、厂商、运力、燃料类型、可回收性等筛选。
- **发动机引擎库**：收录 20+ 款主流液体火箭发动机，包含循环方式、推力、比冲等关键参数，支持按海平面推力和循环方式筛选。
- **智能关联**：自动关联发动机与其驱动的火箭型号（例如：Raptor 2 关联 Starship）。
- **交互体验**：支持多图浏览、大图缩放（Lightbox）、以及全屏详情模态框。
- **静态化支持**：支持将数据库数据导出为静态 JSON，实现无后端的前端独立部署。

## 📂 目录结构规范

```
launch_vehicle_query_system/
├── client/                      # 前端 React 应用 (Vite)
│   ├── public/images/          # 静态图片资源（由export自动生成）
│   │   ├── rockets/           # 火箭图片
│   │   └── engines/           # 发动机图片
│   ├── src/
│   │   ├── data/              # 静态JSON数据（由export自动生成）
│   │   │   ├── rockets.json
│   │   │   └── engines.json
│   │   ├── components/        # React组件
│   │   ├── App.jsx           # 主应用
│   │   └── theme.js          # MUI主题配置
│   └── package.json
├── server/                      # 后端 API 与数据管理
│   ├── prisma/
│   │   ├── schema.prisma     # 数据库模型
│   │   └── dev.db           # SQLite数据库
│   ├── seed.js              # 火箭数据种子
│   ├── seed_engines_manual.js  # 发动机数据种子
│   ├── link_images.js       # 图片关联脚本
│   ├── export_static.js     # 静态数据导出脚本
│   ├── index.js             # Express API服务器
│   └── package.json
├── pic/                         # 原始图片素材库（开发用）
│   ├── rocket_pic/            # 火箭图片源文件
│   └── engine_pic/            # 发动机图片源文件
├── doc/                         # 文档和数据表格
└── start.bat                   # Windows一键启动脚本
```

## 🛠️ 快速启动

### 1. 环境准备
确保已安装：
- Node.js (v18+ 推荐)
- npm 或 yarn

### 2. 首次安装

#### 后端初始化
```bash
cd server
npm install
npx prisma db push        # 创建数据库表结构
npm run seed              # 填充数据 + 关联图片 + 导出JSON
```

**`npm run seed` 会自动完成以下步骤：**
1. 清空并重新填充数据库（火箭+发动机）
2. 扫描 `pic/` 目录并关联图片到数据库
3. 将数据库导出为 JSON 并复制图片到 `client/public/`

#### 前端安装
```bash
cd client
npm install
```

### 3. 运行应用

#### Windows 一键启动（推荐）
```bash
# 在项目根目录
start.bat
```

#### 手动启动

**启动后端服务器：**
```bash
cd server
npm start           # 生产模式
# 或
npm run dev         # 开发模式（支持热重载）
```
后端运行在：`http://localhost:3001`

**启动前端应用：**
```bash
cd client
npm run dev
```
前端运行在：`http://localhost:5173`

## 📸 图片管理详解

> 📖 **完整的图片管理指南请参考**：[IMAGE_MANAGEMENT.md](doc/IMAGE_MANAGEMENT.md)

### 图片工作流程

```
原始图片 (pic/) → 数据库关联 → 导出到 client/public/
```

1. **添加图片**：将图片放入 `pic/rocket_pic/` 或 `pic/engine_pic/`
2. **命名规范**：图片文件名必须与数据库中的 `name` 字段精确匹配
3. **关联图片**：运行 `npm run link` 自动关联图片到数据库
4. **导出到前端**：运行 `npm run export` 复制图片并生成JSON

### 图片命名规范

✅ **正确示例**：
```
长征五号.jpg
CZ-5.png
Falcon 9 (2).jpg       # 第二张图片
Raptor 2.png
YF-100.jpg
```

❌ **错误示例**：
```
长征 五号.jpg          # 多余空格
cz-5.jpg              # 大小写不匹配（需要与数据库中的name完全一致）
猎鹰9号.jpg            # 数据库中是 "Falcon 9"
```

### 多图支持
对于同一型号的多张图片，使用以下命名：
```
长征五号.jpg
长征五号 (2).jpg
长征五号 (3).png
```
系统会自动识别并在前端显示为图集轮播。

### 图片格式要求
- 支持格式：`.jpg`、`.jpeg`、`.png`、`.webp`
- 建议分辨率：800-1200px 宽度
- 建议大小：< 500KB 每张

## 🔄 开发工作流程

### 日常开发流程

1. **修改数据**：编辑 `server/seed.js` 或 `server/seed_engines_manual.js`
2. **添加/更新图片**：将图片放入 `pic/rocket_pic/` 或 `pic/engine_pic/`
3. **重新seed数据库**：
   ```bash
   cd server
   npm run seed         # 完整流程：seed + link + export
   ```
4. **刷新前端**：前端会自动加载最新的JSON数据

### 单独运行各个步骤

```bash
cd server

# 仅重新填充数据库（不关联图片、不导出）
npm run seed:quick

# 仅关联图片到数据库
npm run link

# 仅导出JSON和复制图片到前端
npm run export

# 完整流程（推荐）
npm run seed
```

### 添加新火箭或发动机

1. **编辑seed文件**：
   - 火箭：编辑 `server/seed.js`
   - 发动机：编辑 `server/seed_engines_manual.js`

2. **准备图片**：
   - 将图片命名为与数据中 `name` 字段完全一致
   - 放入对应的 `pic/` 子目录

3. **运行seed**：
   ```bash
   cd server
   npm run seed
   ```

### 修改数据库结构

如果需要修改数据库模型（如添加新字段）：

1. 编辑 `server/prisma/schema.prisma`
2. 运行迁移：
   ```bash
   cd server
   npx prisma db push
   npx prisma generate
   ```
3. 更新seed文件以包含新字段
4. 重新seed：`npm run seed`

## 🎨 厂商命名规范

系统中所有厂商名称统一采用 **"中文 (English)"** 格式，确保火箭和发动机数据的一致性：

### 中国厂商
- 航天一院 (CALT)
- 航天六院 (CAST)
- 航天八院 (SAST)
- 航天科工 (ExPace)
- 蓝箭航天 (LandSpace)
- 星河动力 (Galactic Energy)
- 东方空间 (Orienspace)
- 中科宇航 (CAS Space)
- 天兵科技 (Space Pioneer)
- 星际荣耀 (i-Space)
- 深蓝航天 (Deep Blue)
- 九州云箭 (JZYJ)
- 大航跃迁 (Dahang Yueqian)
- 宇石空间 (Yushi Space)
- 西安航天动力研究所 (XADRI)

### 国际厂商
- SpaceX
- NASA / 波音 (Boeing)
- 联合发射联盟 (ULA)
- 蓝色起源 (Blue Origin)
- 火箭实验室 (Rocket Lab)
- 阿丽亚娜空间 (Arianespace)
- 赫鲁尼切夫 (Khrunichev)
- 日本宇航 (JAXA)

## 🐛 常见问题排查

### 问题：图片不显示

**原因**：数据库中没有关联图片URL

**解决方案**：
```bash
cd server
npm run link         # 重新关联图片
npm run export       # 导出到前端
```

### 问题：修改数据后前端没有更新

**原因**：JSON文件没有重新生成

**解决方案**：
```bash
cd server
npm run export       # 重新导出JSON
# 刷新浏览器页面
```

### 问题：某些图片找不到

**检查清单**：
1. 图片文件名是否与数据库 `name` 字段完全一致？
2. 图片是否放在正确的目录（`pic/rocket_pic/` 或 `pic/engine_pic/`）？
3. 图片格式是否支持（jpg/jpeg/png/webp）？
4. 是否运行了 `npm run link` 和 `npm run export`？

**调试方法**：
```bash
cd server
# 查看数据库中的图片URL
sqlite3 prisma/dev.db "SELECT name, imageUrl FROM Rocket WHERE name = '火箭名称';"
sqlite3 prisma/dev.db "SELECT name, imageUrl FROM Engine WHERE name = '发动机名称';"
```

### 问题：前端运行在错误的端口

如果5173端口被占用，Vite会自动选择下一个可用端口（如5174）。检查终端输出的实际端口。

## 📊 系统数据统计

- **火箭数量**：44+ 款（覆盖中国、美国、欧洲、俄罗斯、日本）
- **发动机数量**：23+ 款（液体发动机）
- **图片资源**：76+ 火箭图片、17+ 发动机图片
- **筛选维度**：10+ 种条件组合

## 🔧 技术栈

### 前端
- React 18
- Material-UI (MUI)
- Vite
- Axios

### 后端
- Node.js + Express
- Prisma ORM
- SQLite

## 📄 开源协议
MIT License