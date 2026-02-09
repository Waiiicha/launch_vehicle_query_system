# 图片管理指南

## 概述

本系统使用智能图片关联机制，自动将 `pic/` 目录中的图片与数据库中的火箭和发动机记录关联。

## 工作流程

```
┌─────────────────┐
│ 原始图片素材    │
│ pic/rocket_pic/ │
│ pic/engine_pic/ │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ 数据库关联      │
│ link_images.js  │  ← 扫描图片，匹配name字段
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ 导出到前端      │
│ export_static.js│  ← 复制图片 + 生成JSON
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ 前端展示        │
│ client/public/  │
│ client/src/data/│
└─────────────────┘
```

## 图片命名规范

### 基本规则

1. **完全匹配**：图片文件名（不含扩展名）必须与数据库中的 `name` 字段完全一致
2. **大小写敏感**：区分大小写，例如 `CZ-5.jpg` 和 `cz-5.jpg` 是不同的
3. **空格保留**：文件名中的空格需要保留，例如 `Falcon 9.jpg`

### 正确示例

#### 火箭图片命名

```
✅ CZ-1.jpg              // 匹配数据库中的 "CZ-1"
✅ CZ-5B.png             // 匹配数据库中的 "CZ-5B"
✅ Falcon 9.jpg          // 匹配数据库中的 "Falcon 9"
✅ 长征五号.jpg           // 匹配数据库中的 "长征五号"
✅ 朱雀二号.png           // 匹配数据库中的 "朱雀二号"
✅ STS（航天飞机）.jpg    // 匹配数据库中的 "STS（航天飞机）"
```

#### 发动机图片命名

```
✅ Raptor 2.jpg          // 匹配数据库中的 "Raptor 2"
✅ YF-100.png            // 匹配数据库中的 "YF-100"
✅ TQ-12A.jpg            // 匹配数据库中的 "TQ-12A"
✅ 力擎二号.png           // 匹配数据库中的 "力擎二号"
```

### 多图命名

对于同一型号的多张图片，在基础名称后添加空格和数字：

```
✅ 长征五号.jpg          // 第一张图片
✅ 长征五号 (2).jpg      // 第二张图片
✅ 长征五号 (3).png      // 第三张图片

✅ Falcon 9.jpg          // 第一张图片
✅ Falcon 9 (2).jpg      // 第二张图片
```

系统会自动识别并在前端显示为可切换的图集。

### 错误示例

```
❌ cz-5.jpg              // 大小写不匹配，数据库是 "CZ-5"
❌ 长征 五号.jpg          // 多余空格
❌ Falcon9.jpg           // 缺少空格，数据库是 "Falcon 9"
❌ 猎鹰9号.jpg            // 中英文不一致，数据库是 "Falcon 9"
❌ YF100.jpg             // 缺少连字符，数据库是 "YF-100"
❌ 长征五号-1.jpg        // 使用 "-1" 而不是 " (2)"
```

## 支持的图片格式

- `.jpg` / `.jpeg`
- `.png`
- `.webp`

## 图片规格建议

### 火箭图片
- **推荐尺寸**：宽度 800-1200px
- **宽高比**：3:4 或 2:3（竖版）
- **文件大小**：< 500KB

### 发动机图片
- **推荐尺寸**：宽度 600-1000px
- **宽高比**：4:3 或 1:1
- **文件大小**：< 300KB

## 添加图片的完整流程

### 方法一：自动流程（推荐）

1. **准备图片**
   ```bash
   # 将图片放入原始素材目录
   pic/rocket_pic/新火箭.jpg
   pic/engine_pic/新发动机.png
   ```

2. **运行完整seed**
   ```bash
   cd server
   npm run seed
   ```
   这会自动完成：
   - 填充数据库
   - 关联图片
   - 导出JSON和图片到前端

3. **刷新浏览器**
   前端会自动加载新的JSON数据和图片

### 方法二：分步执行

如果只是更新图片，不需要重新seed数据库：

```bash
cd server

# 步骤1：关联新图片到数据库
npm run link

# 步骤2：导出到前端
npm run export
```

然后刷新浏览器即可。

## 检查图片是否正确关联

### 方法一：查看数据库

```bash
cd server

# 查看所有有图片的火箭
sqlite3 prisma/dev.db "SELECT name, imageUrl FROM Rocket WHERE imageUrl IS NOT NULL;"

# 查看所有有图片的发动机
sqlite3 prisma/dev.db "SELECT name, imageUrl FROM Engine WHERE imageUrl IS NOT NULL;"

# 查看特定型号的图片
sqlite3 prisma/dev.db "SELECT name, imageUrl FROM Rocket WHERE name = 'CZ-5';"
```

### 方法二：检查日志

运行 `npm run link` 时会输出关联结果：

```
Linked 1 images for Rocket: CZ-5
Linked 2 images for Rocket: Falcon 9
Linked 1 images for Engine: Raptor 2
```

如果某个型号没有输出，说明图片没有匹配成功。

### 方法三：检查JSON文件

查看 `client/src/data/rockets.json` 或 `engines.json`：

```json
{
  "name": "CZ-5",
  "imageUrl": "[\"./images/rockets/CZ-5.jpg\"]",
  // ...
}
```

## 常见问题排查

### 问题1：图片不显示

**可能原因：**
- 数据库中没有关联图片URL
- 图片没有导出到前端
- 文件名不匹配

**解决步骤：**
```bash
cd server

# 1. 检查数据库
sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Rocket WHERE imageUrl IS NOT NULL;"

# 如果数量为0，运行关联
npm run link

# 2. 重新导出
npm run export

# 3. 检查前端目录
dir ..\client\public\images\rockets
dir ..\client\public\images\engines
```

### 问题2：某个型号的图片找不到

**检查清单：**

1. **确认图片文件名**
   ```bash
   # 在pic目录查看实际文件名
   dir pic\rocket_pic\  # Windows
   ls pic/rocket_pic/   # Linux/Mac
   ```

2. **确认数据库中的name字段**
   ```bash
   cd server
   sqlite3 prisma/dev.db "SELECT id, name FROM Rocket WHERE name LIKE '%关键词%';"
   ```

3. **对比两者是否完全一致**
   - 大小写
   - 空格
   - 特殊字符（如中英文括号、连字符）

4. **重新关联**
   ```bash
   npm run link
   npm run export
   ```

### 问题3：多图不显示

确保多图命名格式正确：
```
✅ 火箭名称.jpg
✅ 火箭名称 (2).jpg    // 注意：空格 + 英文括号
✅ 火箭名称 (3).png

❌ 火箭名称(2).jpg     // 缺少空格
❌ 火箭名称（2）.jpg    // 使用了中文括号
❌ 火箭名称-2.jpg      // 使用了连字符
```

### 问题4：修改数据后图片消失

**原因**：重新seed数据库后，如果没有运行link和export，图片关联会丢失

**解决方案**：
```bash
cd server
npm run seed    # 这会自动运行 link 和 export
```

或者更新 `package.json` 确保seed脚本包含完整流程：
```json
{
  "scripts": {
    "seed": "node seed.js && node seed_engines_manual.js && node link_images.js && node export_static.js"
  }
}
```

## 批量处理技巧

### 批量重命名图片

如果需要批量调整图片名称以匹配数据库：

```bash
# Windows PowerShell
Get-ChildItem *.jpg | Rename-Item -NewName { $_.Name -replace "旧模式", "新模式" }

# Linux/Mac
for f in *.jpg; do
  mv "$f" "${f//旧模式/新模式}"
done
```

### 批量压缩图片

使用 ImageMagick：
```bash
# 批量压缩并调整尺寸
magick mogrify -resize 1000x -quality 85 *.jpg
```

### 批量转换格式

```bash
# JPG转PNG
magick mogrify -format png *.jpg

# PNG转JPG
magick mogrify -format jpg *.png
```

## 开发建议

1. **使用版本控制**：将 `pic/` 目录加入 Git，确保图片素材被追踪
2. **定期备份**：定期备份 `pic/` 目录到云存储
3. **命名一致性**：在添加数据时先确定名称，再准备图片
4. **测试关联**：添加新图片后立即运行 `npm run link` 测试是否成功匹配
5. **图片优化**：上传前使用工具压缩图片，减小文件体积

## 自动化建议

可以创建 Git hooks 来自动化图片处理：

```bash
# .git/hooks/pre-commit
#!/bin/bash
cd server
npm run link
npm run export
git add ../client/public/images
git add ../client/src/data
```

这样每次提交代码时会自动更新图片关联。
