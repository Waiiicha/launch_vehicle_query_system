# 全球运载火箭系统 API 文档 (V2)

本文档描述了后端接口的使用方法。基准 URL: `http://localhost:3001`

## 1. 火箭列表接口
获取所有运载火箭信息，支持多维度筛选。

- **URL:** `/api/rockets`
- **Method:** `GET`
- **Query Params:**
  - `search` (string): 按名称、系列或制造商模糊搜索。
  - `country` (string): 国家过滤（支持逗号分隔，如 `中国,美国`）。
  - `minLeo` (number): 最小 LEO 运力 (吨)。
  - `maxLeo` (number): 最大 LEO 运力 (吨)。
  - `minThrust` (number): 最小起飞推力 (kN)。
  - `isReusable` (boolean): 是否可回收 (`true`/`false`)。
- **Success Response:**
  - **Code:** 200
  - **Content:** `Array<RocketObject>`

## 2. 火箭详情接口
获取指定 ID 的火箭所有详细参数。

- **URL:** `/api/rockets/:id`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** `RocketObject`

## 3. 数据结构说明 (RocketObject)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | Int | 内部唯一标识 |
| `name` | String | 型号名称 |
| `country` | String | 所属国家 |
| `leoCapacity` | Float | LEO 运力 (t) |
| `liftoffThrust` | Float | 起飞推力 (kN) |
| `isReusable` | Boolean | 是否可回收 |
| `description` | String | 核心特征描述 |
| ... | ... | ... |
